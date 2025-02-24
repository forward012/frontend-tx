import React from "react";

function Trigger({ triggerData, side, setTriggerData }) {
  return (
    <div className="flex gap-4 border rounded-xl p-4 mt-4">
      <div className="flex items-center">
        <label
          htmlFor="triggerPrice"
          style={{textWrap: "nowrap"}}
          className="mb-2 mr-4 text-lg font-semibold text-gray-700 text-nowrap"
        >
          High/Low Trigger Price(%):
        </label>
        <input
          id="triggerPrice"
          type="text"
          value={triggerData.triggerPrice}
          onChange={(e) =>
            setTriggerData({
              ...triggerData,
              triggerPrice: e.target.value,
              side: side
            })
          }
          className="w-24 p-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          placeholder="%"
        />
        
      </div>
      <div className="flex items-center w-full">
        <label
          htmlFor="stopLossPrice"
          className="mb-2 mr-4 text-lg font-semibold text-gray-700"
        >
          TP/SL($):
        </label>
        <input
          id="triggerPrice"
          type="text"
          disabled={true}
          // value={triggerData.takeProfit}
          // onChange={(e) =>
          //   setTriggerData({
          //     ...triggerData,
          //     triggerPrice: e.target.value,
          //   })
          // }
          className={`w-24 p-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out cursor-not-allowed`}
          placeholder="USDT"
        />
        <input
          id="stopLossPrice"
          type="text"
          value={triggerData.stopLossPrice}
          onChange={(e) =>
            setTriggerData({
              ...triggerData,
              stopLossPrice: e.target.value,
            })
          }
          className="w-24 p-2 border border-gray-300 rounded-r-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          placeholder="USDT"
        />
      </div>
        <div className="w-full flex items-center ">
            <label htmlFor="time" className="mb-2 mr-4 text-lg font-semibold text-gray-700">
                Margin($): 
            </label>
            <input
                id="time"
                type="text"
                disabled={true}
                // value={triggerData.triggerPrice}
                // onChange={(e) =>
                //   setTriggerData({
                //     ...triggerData,
                //     triggerPrice: e.target.value,
                //   })
                // }
                className="w-24 p-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out box-border"
                placeholder="$"
            />
            <button 
                disabled={true}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200 ease-in-out cursor-pointer"
            >
                ADD
            </button>
        </div>
    </div>
  );
}
export default Trigger;