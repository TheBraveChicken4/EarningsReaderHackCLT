import { React, useState } from 'react';

const Homepage = () => {
    const [url, setUrl] = useState(``);

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
                await fetch('/run-script');
            } else {
                console.error('Error writing URL to file');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className="homepage min-h-screen text-center">
            <h1 className="text-[10vh]">Call Report</h1>
            <p className="m-[2vh] m-b-[2vh]">Enter a URL below to collect information from the earnings call.</p>
            <form onSubmit={handleSubmit} className="items-center">
                <input 
                    type="url" 
                    name="url" 
                    id="url" 
                    placeholder="Enter URL" 
                    className="h-[3.5vh] w-[10%] p-[10px] border-b-2 border-blue-900 bg-[url(Assets/search_icon.png)] [background-size:2vh] bg-[left] bg-no-repeat pl-[40px] rounded-l-sm
                                focus:outline-none transition-colors duration-200"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button type="submit" className="flex-grow min-h-[calc(3.9vh-2px)] min-w-[5%] bg-blue-900 text-white rounded-r-lg">Search</button>
            </form>
        </div>
    );
};

export default Homepage;