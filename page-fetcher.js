const axios = require('axios');
const R = require('ramda');

const getPage = (url) => 
    axios(url)
        .then(R.prop('data'));



module.exports = {
    getPage,
};