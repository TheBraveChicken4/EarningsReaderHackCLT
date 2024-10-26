import {React, useState} from 'react'

const Homepage = () => {
    const [url, setUrl] = useState(``);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlData = {url}
        console.log('Sending URl: ', urlData);

        try{
            const response = await fetch('http://localhost:3000/write-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({url}),
            });

            if (response.ok) {
                await fetch('/run-script');
            } else {
                console.error('Error writing URL to file');
            }
        } catch(error){
            console.error('Fetch error:', error);
        }
    }
  return (
    <div className='homepage' class="text-center">
        <h1 class="text-[10vh]">Call Report</h1>
        <p>Enter a URL below to collect information from the earnings call.</p>
        <form onSubmit={handleSubmit} class="mt-[1vh]">
            <input 
                type="url" 
                name="url" 
                id="url" 
                placeholder="Enter URL" 
                class="border-2 border-black-100/10 "
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit" class="bg-[black] text-[white]">Search</button>
        </form>
    </div>
  )
}

export default Homepage