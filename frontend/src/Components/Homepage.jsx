import { React, useState } from 'react';

const Homepage = () => {
    const [url, setUrl] = useState('');
    const [urlSuccessMessage, setUrlSuccessMessage] = useState('');
    const [recordingSuccessMessage, setRecordingSuccessMessage] = useState('');
    const [modelSuccessMessage, setModelSuccessMessage] = useState('');
    const [isRecordingRunning, setIsRecordingRunning] = useState(false);
    const [isModelRunning, setIsModelRunning] = useState(false);

    const isValidUrl = (string) => {
        const pattern = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z0-9]\\w*)\\.)+[a-z]{2,}|' +
            'localhost|' +
            '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +
            '\\[?[a-fA-F0-9]*:[a-fA-F0-9:%.]*\\]?)' +
            '(\\:\\d+)?(\\/[-a-z0-9+&@#\\/%?=~_|!:,.;]*[a-z0-9+&@#\\/%=~_|])?$', 'i');
        return !!pattern.test(string);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidUrl(url)) {
            console.error('Invalid URL:', url);
            return; // Exit if the URL is invalid
        }

        const urlData = { url };
        console.log('Sending URL: ', urlData);

        try {
            const response = await fetch('http://localhost:3000/write-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                setUrlSuccessMessage('URL submitted successfully'); // Set success message
                setUrl(''); // Clear the input field
            } else {
                console.error('Error writing URL to file');
                setUrlSuccessMessage('Error submitting URL.'); // Set error message
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setUrlSuccessMessage('Error submitting URL.'); // Set error message
        }
    };

    const handleRecordingStart = async () => {
        try {
            const response = await fetch('http://localhost:3000/set-recording-running', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recordingRunning: true }),
            });

            if (response.ok) {
                setIsRecordingRunning(true);
                setRecordingSuccessMessage('Recording started successfully');
                setModelSuccessMessage(''); // Clear model success message if needed
            } else {
                console.error('Error starting recording');
                setRecordingSuccessMessage('Error starting recording');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setRecordingSuccessMessage('Error starting recording.');
        }
    };

    const handleRecordingStop = async () => {
        try {
            const response = await fetch('http://localhost:3000/set-recording-running', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recordingRunning: false }),
            });

            if (response.ok) {
                setIsRecordingRunning(false);
                setRecordingSuccessMessage('Recording stopped successfully');
            } else {
                console.error('Error stopping recording');
                setRecordingSuccessMessage('Error stopping recording');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setRecordingSuccessMessage('Error stopping recording.');
        }
    };

    const handleModelStart = async () => {
        try {
            const response = await fetch('http://localhost:3000/set-model-running', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelRunning: true }),
            });

            if (response.ok) {
                setIsModelRunning(true);
                setModelSuccessMessage('Model started successfully');
                setRecordingSuccessMessage(''); // Clear recording success message if needed
            } else {
                console.error('Error starting model');
                setModelSuccessMessage('Error starting model');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setModelSuccessMessage('Error starting model.');
        }
    };

    const handleModelStop = async () => {
        try {
            const response = await fetch('http://localhost:3000/set-model-running', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelRunning: false }),
            });

            if (response.ok) {
                setIsModelRunning(false);
                setModelSuccessMessage('Model stopped successfully');
            } else {
                console.error('Error stopping model');
                setModelSuccessMessage('Error stopping model');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setModelSuccessMessage('Error stopping model.');
        }
    };

    return (
        <div className="homepage min-h-screen text-center font-customFont">
            <h1 className="text-[10vh] ">Call Report</h1>
            <p className="m-[2vh] m-b-[2vh] ">Enter a URL below to collect information from the earnings call.</p>
            <form onSubmit={handleSubmit} className="items-center">
                <input 
                    type="url" 
                    name="url" 
                    id="url" 
                    placeholder="Enter URL" 
                    className="h-[3.5vh] min-w-[5%] p-[10px] border-b-2 border-blue-900 bg-[url(Assets/search_icon.png)] [background-size:2vh] bg-[left] bg-no-repeat pl-[40px] rounded-l-sm
                                focus:outline-none transition-colors duration-200"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button type="submit" className="flex-grow min-h-[calc(3.9vh-2px)] min-w-[5%] bg-blue-900 text-white rounded-r-lg
                                hover:bg-blue-500 duration-300">Search</button>
            </form>
            {urlSuccessMessage && (
                <p className="mt-4 text-green-600">{urlSuccessMessage}</p>
            )}
            <div className="recorder mt-5 items-center">
                <p className="mb-[1vh]">Use the buttons below to record information from an earnings call.</p>
                <button onClick={handleRecordingStart} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-l-full bg-green-600 text-white hover:bg-green-400 duration-300">Start Recording</button>
                <button onClick={handleRecordingStop} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-r-full bg-red-600 text-white hover:bg-red-400 duration-300">Stop Recording</button>
                {recordingSuccessMessage && (
                    <p className="mt-4 text-green-600">{recordingSuccessMessage}</p>
                )}
            </div>
            <div className="model mt-5">
                <p className="mb-[1vh] ">Use the buttons below to begin processing.</p>
                <button onClick={handleModelStart} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-l-full bg-green-600 text-white hover:bg-green-400 duration-300">Start Model</button>
                <button onClick={handleModelStop} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-r-full bg-red-600 text-white hover:bg-red-400 duration-300">Stop Model</button>
                {modelSuccessMessage && (
                    <p className="mt-4 text-green-600">{modelSuccessMessage}</p>
                )}
            </div>
        </div>
    );
};

export default Homepage;
