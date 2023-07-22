const axios = require("axios");

const processIntent = async (searchText) => {
    const options = {
        headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YTBlMTUzNTdkNDU0ZmJiYWE4YWU4NTBmZWJmNWUyMCIsImlhdCI6MTY4OTE4NDU5MCwiZXhwIjoyMDA0NTQ0NTkwfQ._B-HrWD1sdkFbkidD6rrv9HnSFD-4m9y6RiYpDMN9U0'}
    };

    console.log(`Sending request with phrase: ${searchText}`)

   const result = await axios.post('http://192.168.1.107:8123/api/conversation/process',
        {
            text: searchText,
            language: 'uk'
        }, options
    );
    const data = result.data;
    console.log(data);
    console.log(data.response.speech.plain);
}

module.exports = {
    processIntent
}