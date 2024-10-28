import { React, useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const Comparison = () => {
    const [companyData, setCompanyData] = useState([]);
    const [selectedCompany1, setSelectedCompany1] = useState('');
    const [selectedCompany2, setSelectedCompany2] = useState('');
    const [selectedQuarter1, setSelectedQuarter1] = useState('');
    const [selectedQuarter2, setSelectedQuarter2] = useState('');
    const [quartersForCompany1, setQuartersForCompany1] = useState([]);
    const [quartersForCompany2, setQuartersForCompany2] = useState([]);
    const [data1, setData1] = useState({});
    const [data2, setData2] = useState({});

    const chartStyle = {
        height: 250,
    };

    const fetchCompanyData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/data.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCompanyData(data);
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, []);

    useEffect(() => {
        if (selectedCompany1) {
            const quarters = [...new Set(companyData
                .filter(item => item.companyName === selectedCompany1)
                .map(item => item.quarterYear))];
            setQuartersForCompany1(quarters);
        } else {
            setQuartersForCompany1([]);
        }

        if (selectedCompany1 && selectedQuarter1) {
            const data = companyData.find(item => item.companyName === selectedCompany1 && item.quarterYear === selectedQuarter1);
            setData1(data || {});
        }

    }, [selectedCompany1, selectedQuarter1, companyData]);

    useEffect(() => {
        if (selectedCompany2) {
            const quarters = [...new Set(companyData
                .filter(item => item.companyName === selectedCompany2)
                .map(item => item.quarterYear))];
            setQuartersForCompany2(quarters);
        } else {
            setQuartersForCompany2([]);
        }

        if (selectedCompany2 && selectedQuarter2) {
            const data = companyData.find(item => item.companyName === selectedCompany2 && item.quarterYear === selectedQuarter2);
            setData2(data || {});
        }

    }, [selectedCompany2, selectedQuarter2, companyData]);

    return (
        <div className="comparison text-center">
            <h1>Compare Earnings Calls</h1>
            <div className="dropdowns flex justify-center gap-[20px]">
                <select onChange={(e) => setSelectedCompany1(e.target.value)} value={selectedCompany1}>
                    <option value="">Select Company 1</option>
                    {[...new Set(companyData.map(item => item.companyName))].map((company, index) => (
                        <option key={index} value={company}>{company}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedQuarter1(e.target.value)} value={selectedQuarter1}>
                    <option value="">Select Quarter/Year for Company 1</option>
                    {selectedCompany1 && quartersForCompany1.map((quarter, index) => (
                        <option key={index} value={quarter}>{quarter}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedCompany2(e.target.value)} value={selectedCompany2}>
                    <option value="">Select Company 2</option>
                    {[...new Set(companyData.map(item => item.companyName))].map((company, index) => (
                        <option key={index} value={company}>{company}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedQuarter2(e.target.value)} value={selectedQuarter2}>
                    <option value="">Select Quarter/Year for Company 2</option>
                    {selectedCompany2 && quartersForCompany2.map((quarter, index) => (
                        <option key={index} value={quarter}>{quarter}</option>
                    ))}
                </select>
            </div>
            <div className="gauges flex justify-center gap-[40px] mt-[10vh]">
                <div>
                    <h2>{selectedCompany1} {selectedQuarter1 && `- ${selectedQuarter1}`}</h2>
                    <GaugeChart
                        style={chartStyle}
                        id="gauge1"
                        percent={data1.sentimentPercent || 0}
                        animate={false}
                        arcWidth={0.3}
                        colors={["#FF5252", "#4CAF50"]}
                        nrOfLevels={20}
                        textColor="#000000"
                    />
                </div>
                <div>
                    <h2>{selectedCompany2} {selectedQuarter2 && `- ${selectedQuarter2}`}</h2>
                    <GaugeChart
                        style={chartStyle}
                        id="gauge2"
                        percent={data2.sentimentPercent || 0}
                        animate={false}
                        arcWidth={0.3}
                        colors={["#FF5252", "#4CAF50"]}
                        nrOfLevels={20}
                        textColor="#000000"
                    />
                </div>
            </div>
        </div>
    );
};

export default Comparison;