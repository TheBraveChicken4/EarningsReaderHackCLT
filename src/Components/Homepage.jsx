import {React, useState} from 'react'

const Homepage = () => {
    function searchData(formData){
        const queryLink = formData.get("query");
        alert(`You searched for '${queryLink}'`);
    }
  return (
    <div className='homepage' class="text-center">
        <h1 class="text-[10vh]">Call Report</h1>
        <p>Enter a URL below to collect information from the earnings call.</p>
        <form action={searchData} class="mt-[1vh]">
            <input type="url" name="url" id="url" placeholder="Enter URL" class="border-2 border-black-100/10 "/>
            <button type="submit" value="Submit" class="bg-[black] text-[white]">Search</button>
        </form>
    </div>
  )
}

export default Homepage