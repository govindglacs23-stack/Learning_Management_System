const axios = require('./backend/node_modules/axios');

async function testAPI() {
    try {
        const response = await axios.get('http://localhost:5000/api/courses/69ce0b9a750e779128197249');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testAPI();