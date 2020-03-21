const axios = require('axios');
const R = require('ramda');

const getIndexPage = (url) => 
    axios(url)
        .then(R.prop('data'));



module.exports = {
    getIndexPage,
};