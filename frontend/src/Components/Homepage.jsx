import { React, useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const Homepage = () => {
    const [companyName, setCompanyName] = useState('');
const [qxYear, setQxYear] = useState('');
const [urlSuccessMessage, setUrlSuccessMessage] = useState('');
const [modelSuccessMessage, setModelSuccessMessage] = useState('');
const [, setIsModelRunning] = useState(false);
const [sentiment, setSentiment] = useState(0);
const [sentimentPercent, setSentimentPercent] = useState(0);
const [sentimentEval, setSentimentEval] = useState(0);
const [sentimentColor, setSentimentColor] = useState(0);

const chartStyle = {
    height: 250,
};

// Fetch sentiment values from server
const fetchSentiment = async () => {
    try {
        const response = await fetch('http://localhost:3000/sentiment');
        if (response.ok) {
            const data = await response.json();
            setSentiment(data);
        } else {
            console.error('Error fetching sentiment data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

useEffect(() => {
    fetchSentiment();
}, []);

// Recalculate sentimentPercent whenever sentiment changes
useEffect(() => {
    const percent = parseFloat(sentiment);
    setSentimentPercent(percent);
    console.log(percent);
    
        let color = "black";
        let sentimentClassification = "No Sentiment Detected";
        if (percent <= 0.2) {
            sentimentClassification = "Very Poorly";
            color = "red";
        } else if (percent <= 0.4) {
            sentimentClassification = "Mostly Poorly";
            color = "maroon";
        } else if (percent <= 0.6) {
            sentimentClassification = "Neutral";
        } else if (percent <= 0.8) {
            sentimentClassification = "Mostly Well";
            color = "green";
        } else {
            sentimentClassification = "Very Well";
            color = "lime";
        }
        setSentimentEval(sentimentClassification);
        setSentimentColor(color);
    }, [sentiment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Start the model if it's not already running
        await handleModelStart();
    
        const data = { companyName, qxYear, sentimentPercent };
        console.log('Sending Data:', data);
    
        try {
            const response = await fetch('http://localhost:3000/write-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                const result = await response.json();
                setSentimentPercent(result.sentimentPercent); // Update sentiment percent from response
                setUrlSuccessMessage('Data submitted successfully'); // Set success message
                setCompanyName(''); // Clear the input field
                setQxYear(''); // Clear the input field
            } else {
                console.error('Error writing data to file');
                setUrlSuccessMessage('Error submitting data.'); // Set error message
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setUrlSuccessMessage('Error submitting data.'); // Set error message
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
                console.log("MODELRUNNING set to true");
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
            <h1 className="text-[8vh] ">Earnings Call Report</h1>
            <p className="m-[2vh] m-b-[2vh] ">Enter the company name and earnings call date below.</p>
            <form onSubmit={handleSubmit} className="items-center">
                <input 
                    type="text" 
                    name="companyName" 
                    id="companyName" 
                    placeholder="Enter Company Name" 
                    className="h-[3.5vh] min-w-[5%] p-[10px] border-b-2 border-blue-900 bg-no-repeat rounded-l-sm
                                focus:outline-none transition-colors duration-200"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <input 
                    type="text" 
                    name="qxYear" 
                    id="qxYear" 
                    placeholder="Enter QX Year" 
                    className="h-[3.5vh] min-w-[5%] p-[10px] border-b-2 border-blue-900 bg-no-repeat rounded-l-sm
                                focus:outline-none transition-colors duration-200"
                    value={qxYear}
                    onChange={(e) => setQxYear(e.target.value)}
                />
                <button type="submit" className="flex-grow min-h-[calc(3.9vh-2px)] min-w-[5%] bg-blue-900 text-white rounded-r-lg
                                hover:bg-blue-500 duration-300">Submit</button>
            </form>
            {urlSuccessMessage && (
                <p className="mt-4 text-green-600">{urlSuccessMessage}</p>
            )}
            <div className="model mt-5">
                <p className="mb-[1vh] ">Use the buttons below to begin processing.</p>
                <button onClick={handleModelStart} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-l-full bg-green-600 text-white hover:bg-green-400 duration-300">Start Model</button>
                <button onClick={handleModelStop} className="min-h-[4vh] min-w-[6vh] p-[6px] rounded-r-full bg-red-600 text-white hover:bg-red-400 duration-300">Stop Model</button>
                {modelSuccessMessage && (
                    <p className="mt-4 text-green-600">{modelSuccessMessage}</p>
                )}
            </div>
            <div className="results mt-5 text-center">
                <h2 className="text-[4vh]">Earnings Call Summary</h2>
                <div className="gauge text-center max-w-[50%] m-auto block">
                    <GaugeChart id="call-result-chart" style={chartStyle} 
                        animate={false} 
                        arcWidth={0.3} 
                        colors={["#FF5252", "#4CAF50"]} 
                        nrOfLevels={20}
                        percent={sentimentPercent}
                        textColor="#000000"
                    />
                    <p className="m-[10vh] text-xl ">Based on this earnings call, the company is doing: <span style={{color: sentimentColor}}>{sentimentEval}</span></p>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
