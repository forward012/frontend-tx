const crypto = require("crypto");
const axios = require("axios");

// Generate MD5 hash as hex
function md5(value) {
  return crypto.createHash("md5").update(value, "utf8").digest("hex");
}

function mexc_crypto(key, obj) {
  const timestamp = String(Date.now());
  // In Python, md5(key + timestamp)[7:] takes the substring from index 7 onward.
  // We do the equivalent in JavaScript.
  const g = md5(key + timestamp).slice(7);
  // JSON.stringify produces minimal JSON when no extra parameters are passed.
  const s = JSON.stringify(obj);
  const sign = md5(timestamp + s + g);
  return { time: timestamp, sign: sign };
}

class AllApi {
  constructor(KEY, BASE_URL) {
    this.web_key = KEY;
    this.base_url = BASE_URL;
    this.base_headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      Authorization: KEY,
      Cookie: "u_id=" + KEY,
    };
  }

  async post_order(obj) {
    // market and limit
    const signature = mexc_crypto(this.web_key, obj);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    const end_point = "/api/v1/private/order/create";

    try {
      const response = await axios.post(this.base_url + end_point, obj, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in post_order:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async post_order_trigger(obj) {
    const end_point = "/api/v1/private/planorder/place/v2";
    const signature = mexc_crypto(this.web_key, obj);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(this.base_url + end_point, obj, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in post_order_trigger:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async get_open_orders_limit() {
    const end_point = "/api/v1/private/order/list/open_orders";
    try {
      const response = await axios.get(this.base_url + end_point, {
        headers: this.base_headers,
        data: [], // note: axios uses 'data' for POST so GET requests typically don’t require it.
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in get_open_orders_limit:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async get_stop_open_orders() {
    const end_point = "/api/v1/private/stoporder/open_orders?";
    try {
      const response = await axios.get(this.base_url + end_point, {
        headers: this.base_headers,
        data: [], // note: axios uses 'data' for POST so GET requests typically don’t require it.
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in get_open_orders_limit:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async get_orders_triger() {
    const end_point = "/api/v1/private/planorder/list/orders?states=1";
    try {
      const response = await axios.get(this.base_url + end_point, {
        headers: this.base_headers,
        data: [],
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in get_orders_triger:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async get_open_positions() {
    const end_point = "/api/v1/private/position/open_positions";
    try {
      const response = await axios.get(this.base_url + end_point, {
        headers: this.base_headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in get_open_positions:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }
  async close_all_positions() {
    const end_point = "/api/v1/private/position/close_all";
    // Python code uses an empty object
    const signature = mexc_crypto(this.web_key, {});
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(
        this.base_url + end_point,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error in close_all_limits:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async close_all_limits() {
    const end_point = "/api/v1/private/order/cancel_all";
    // Python code uses an empty object
    const signature = mexc_crypto(this.web_key, {});
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(
        this.base_url + end_point,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error in close_all_limits:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async close_all_stop_orders() {
    const end_point = "/api/v1/private/stoporder/cancel_all";
    // Python code uses an empty object
    const signature = mexc_crypto(this.web_key, {});
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(
        this.base_url + end_point,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error in close_all_limits:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async close_planorder_triger(obj) {
    const end_point = "/api/v1/private/planorder/cancel";
    const signature = mexc_crypto(this.web_key, obj);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };

    try {
      const response = await axios.post(this.base_url + end_point, [obj], {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in close_order_triger:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async close_all_planorders_triger() {
    const end_point = "/api/v1/private/planorder/cancel_all";
    const signature = mexc_crypto(this.web_key);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    // Python code sends an empty object instead.
    try {
      const response = await axios.post(
        this.base_url + end_point,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error in close_all_orders_triger:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async add_ST_TP_for_limit(obj) {
    const end_point = "/api/v1/private/stoporder/change_price";
    const signature = mexc_crypto(this.web_key, obj);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      "x-mxc-sign": signature.sign,
      "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(this.base_url + end_point, obj, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in add_ST_TP_for_limit:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }

  async add_margin(obj) {
    // Expected obj format: {amount: '0.5134', positionId: id, type: 'ADD'}
    const end_point = "/api/v1/private/position/change_margin";
    // const signature = mexc_crypto(this.web_key, obj);
    const headers = {
      ...this.base_headers,
      "Content-Type": "application/json",
      // "x-mxc-sign": signature.sign,
      // "x-mxc-nonce": signature.time,
    };
    try {
      const response = await axios.post(this.base_url + end_point, obj, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in add_margin:",
        error.message,
        error.response && error.response.data
      );
      throw error;
    }
  }
}

module.exports = AllApi;
