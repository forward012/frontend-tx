//Dashboard.jsx
import React, { useState, useEffect } from "react";
import Trigger from "./components/Trigger";
import axios from "axios";

function Dashboard() {
    const [currentTime, setCurrentTime] = useState();
    const [executionTime, setExecutionTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [timeout, setTimeout] = useState("");
    const [leverage, setLeverage] = useState("");
    const [quantity, setQuantity] = useState("");
    const defaultTrigger = {
        symbol: "BTC_USDT",
        // leverage: 1,
        // orderType: 5, //order type, 1: limit order, 2: Post Only Maker, 3: close or cancel instantly, 4: close or cancel completely, 5: Market order
        // openType: 1, //open type, 1: isolated, 2: cross
        side: "", ///1 for open long, 2 for close short, 3 for open short, and 4 for close long
        // triggerType: 1, //trigger type, 1: more than or equal, 2: less than or equal
        triggerPrice: "",
        // vol: 1,
        stopLossPrice: "",
        // trend: 1, //trigger price type, 1: latest price, 2: fair price, 3: index price
        // executeCycle: 3, //execution cycle, 1: 24 hours, 2: 7 days
        // marketCeiling: false,
        // positionMode: 1,
        // profitTrend: "1",
        // lossTrend: "1",
        // priceProtect: "0",
    };
    const [triggerData1, setTriggerData1] = useState({ ...defaultTrigger });
    const [triggerData2, setTriggerData2] = useState({ ...defaultTrigger });
    const [triggerData3, setTriggerData3] = useState({ ...defaultTrigger });
    const [triggerData4, setTriggerData4] = useState({ ...defaultTrigger });
    const [triggerData5, setTriggerData5] = useState({ ...defaultTrigger });
    const [triggerData6, setTriggerData6] = useState({ ...defaultTrigger });
    const [triggerDatas, setTriggerDatas] = useState([]);

    const pairs = ["BTC_USDT", "ETH_USDT"];
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    
    const getCurrentTimeUSTMinus5 = () => {
        // Create a date object for the current time
        const currentDate = new Date();
        // Convert to UST-5 (Eastern Standard Time) using toLocaleString
        const options = {
            timeZone: 'America/New_York', // UST-5 during standard time
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Use 24-hour format
        };
        // Format the date and time
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
        // Split the formatted date into components
        const [date, time] = formattedDate.split(', ');
        // Replace slashes with colons and format as required
        const [month, day, year] = date.split('/');
        const [hour, minute, second] = time.split(':');
        setCurrentDate(`${year}-${month}-${day}`);
        // Return the formatted string
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(getCurrentTimeUSTMinus5()); 
        }, 1000)
    }, [])
    
    useEffect(() => {
        setTriggerDatas([
          triggerData1,
          triggerData2,
          triggerData3,
          triggerData4,
          triggerData5,
          triggerData6,
        ]);
    }, [triggerData1, triggerData2, triggerData3, triggerData4, triggerData5, triggerData6]);

    const startTrading = async () => {
        const updatedTriggers = triggerDatas.filter(
            (trigger) => JSON.stringify(trigger) !== JSON.stringify(defaultTrigger)
        );
        console.log("triggerDatas", updatedTriggers);

        try {
            console.log("Close trading response:", currentDate+" "+executionTime);
            const response = await axios.post(
                `${SERVER_URL}/api/triggerOrder`, 
                {
                    data: updatedTriggers,
                    leverage: leverage,
                    quantity: quantity,
                    "pairs": pairs,
                    executionTime: currentDate+" "+executionTime,
                    timeout: timeout
                }
            );
            console.log("Close trading response:", response);
        } catch (error) {
            console.error("Error closing trading:", error);
        }
    }
    
    const addMargin = () => {
        // const marginObj = {
        //     amount: "500",
        //     positionId: "22165579",
        //     type: "ADD",
        // };
        // const fetchData = async () => {
        //     try {
        //         const result_add = await bot.add_margin(marginObj);
        //         console.log("result_add_margin:", result_add);
        //     } catch (error) {
        //         console.error("Error in fetching data:", error);
        //     }
        // };
        // fetchData();
    }

    const closeTrading = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/closeAllOrdersAndPositions`);
        console.log("Close trading response:", response);
      } catch (error) {
        console.error("Error closing trading:", error);
      }
    }

    return (
        <>
        <div className="w-full px-8 ">
            <label htmlFor="time" className="w-full flex justify-center text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 mr-4 text-lg font-semibold text-gray-700">
                Current Time(UTC-5, New_York): {currentTime}
            </label>
            
            <div className="w-full flex justify-center items-center ">
                <label htmlFor="time" className="mb-2 mr-4 text-lg font-semibold text-gray-700">
                    Enter Trading Time: 
                </label>
                {/* {
                    currentTime?.split(":").map((time, index) => (
                        index === 0 && <label key={index} className="h-8 mr-4 border round-lg">
                          {time}
                        </label>
                    ))
                } */}
                <input
                    id="time"
                    type="text"
                    value={executionTime}
                    onChange={(e) => setExecutionTime(e.target.value)}
                    className="w-48 mr-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    placeholder="MM:SS"
                />
                <input
                    id="time"
                    type="text"
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                    className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    placeholder="Ex: 30(s)"
                />
            </div>
            <div className="flex gap-4 mt-4">
                Trading Pairs:
                {
                    pairs.map((name, index) => <label key={index} className="bg-blue-500 text-white font-semibold py-1 px-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200 ease-in-out">
                            {name}
                    </label>)
                }
            </div>
            <div className="mt-4">
                <label htmlFor="time" className="mb-2 mr-4 text-lg font-semibold text-gray-700 text-nowrap">
                    Token Price: Market 
                </label>
                <label 
                    htmlFor="leverage" 
                    className="mb-2 mr-4 text-lg font-semibold text-gray-700 text-nowrap"
                >
                    Leverage:
                </label>
                <input
                    id="leverage"
                    type="text"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-36 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    placeholder="Ex: 100x"
                />
                <label 
                    htmlFor="quantity" 
                    className="mb-2 mx-4 text-lg font-semibold text-gray-700 text-nowrap"
                >
                    Quantity:
                </label>
                <input
                    id="quantity"
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-36 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    placeholder="USDT"
                />
            </div>

            <Trigger triggerData={triggerData1} side="1" setTriggerData={setTriggerData1} tradingType="Open Long" />
            <Trigger triggerData={triggerData2} side="1" setTriggerData={setTriggerData2} tradingType="Open Long" />
            <Trigger triggerData={triggerData3} side="1" setTriggerData={setTriggerData3} tradingType="Open Long" />

            <Trigger triggerData={triggerData4} side="3" setTriggerData={setTriggerData4} tradingType="Open Short" />
            <Trigger triggerData={triggerData5} side="3" setTriggerData={setTriggerData5} tradingType="Open Short"/>
            <Trigger triggerData={triggerData6} side="3" setTriggerData={setTriggerData6} tradingType="Open Short"/>

            <button 
                className="w-full mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200 ease-in-out cursor-pointer"
                onClick={startTrading}
            >
                Trading Start
            </button>
            <button 
                className="w-full mt-4 bg-green-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-300 transition duration-200 ease-in-out cursor-pointer"
                onClick={addMargin}
            >
                Add Margin
            </button>
            <button 
                className="w-full mt-4 bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-300 transition duration-200 ease-in-out cursor-pointer"
                onClick={closeTrading}
            >
                Trading Close
            </button>
        </div>
        </>
    )
}

export default Dashboard;