// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const AllApi = require("./api");
const app = express();
require("dotenv").config();

// app.use(
//   cors({
//     origin: "https://yourdeployedsite.com",
//   })
// );

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT; // Choose your port
const KEY = process.env.KEY;

const BASE_URL_TEST = process.env.BASE_URL_TEST;
const BASE_URL = process.env.BASE_URL;

const API_URL = "https://api.mexc.com";

const getTimeStamp = () => {
  const date = new Date();
  const timestamp = date.getTime();
  return timestamp;
};

const bot = new AllApi(KEY, BASE_URL_TEST);

app.get("/api/test", (req, res) => {
  res.json({ message: "success" });
});

app.get("/api/order", async (req, res) => {
  console.log("Received Request");

  datas = [
    {
      symbol: "BTC_USDT",
      side: 1,
      openType: 1,
      type: "5",
      leverage: 20,
      vol: 90,
      marketCeiling: false,
      takeProfitPrice: "99390.0",
      stopLossPrice: "95409.9",
      lossTrend: "1",
      profitTrend: "1",
      priceProtect: "0",
    },
  ];

  const postOrder = async (payload) => {
    try {
      const response = await bot.post_order(payload);
      console.log("response: ", response);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };
  datas.map((data) => postOrder(data));
});

const getAvgPrice = async (symbol) => {
  const formattedSymbol = symbol.replace("_", "");
  try {
    const response = await axios.get(
      `${API_URL}/api/v3/avgPrice?symbol=${formattedSymbol}`
    );
    return response.data.price;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/triggerOrder", async (req, res) => {
  console.log("Received Request");
  console.log("getTimeStamp--Start: ", getTimeStamp());

  const { data, leverage, quantity, pairs, executionTime, timeout } = req.body;

  const pairsData = await Promise.all(
    pairs.map(async (pair) => ({
      symbol: pair,
      price: await getAvgPrice(pair),
    }))
  );
  console.log("2222getTimeStamp--End: ", getTimeStamp());

  console.log("datas___________", pairsData);

  const updateData = await pairsData.flatMap((pair) =>
    data.map((item) => ({
      symbol: pair.symbol, // use the pair from the pairs array
      leverage: leverage,
      triggerType: 1,
      triggerPrice: (1 + item.triggerPrice / 100) * pair.price,
      side: item.side,
      openType: 1,
      orderType: 5,
      trend: 1,
      vol: quantity,
      stopLossPrice: pair.price * (1 - 0.02 - item.stopLossPrice / 100),
      executeCycle: 3,
      marketCeiling: false,
      positionMode: 1,
      lossTrend: "1",
      priceProtect: "0",
    }))
  );
  console.log("3333getTimeStamp--End: ", getTimeStamp());

  console.log("updatePrices++++++++++++++++++++++++++++++++", updateData);
  const postOrder = async (payload) => {
    try {
      const response = await bot.post_order_trigger(payload);
      console.log("response: ", response);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };
  await Promise.all(updateData.map((data) => postOrder(data)));

  //30s all orders and positions will close automatically timeout later.
  if (timeout > 0) {
    await setTimeout(async () => {
      await closeAllOrders();
    }, timeout * 1000);
  }

  console.log("getTimeStamp--End: ", getTimeStamp());
});

app.get("/api/closeAllOrdersAndPositions", async (req, res) => {
  const data = req.body; // PlanOrder Lists from request body
  console.log(data);
  console.log("received requests");
  await closeAllOrders();
});

const closeAllOrders = async () => {
  try {
    const response = await bot.close_all_positions();
    console.log("response: ", response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating data");
  }

  // try {
  //   const response = await bot.close_all_limits();
  //   console.log("response: ", response);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Error updating data");
  // }

  // try {
  //   const response = await bot.close_all_stop_orders();
  //   console.log("response: ", response);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Error updating data");
  // }

  try {
    const response = await bot.close_all_planorders_triger();
    console.log("response: ", response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating data");
  }
};
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
