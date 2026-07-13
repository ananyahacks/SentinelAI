const axios = require("axios");
const analyzeLogs = async (logs) => {

    const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        {
            logs: logs
        }
    );

    return response.data;
};

module.exports = analyzeLogs;