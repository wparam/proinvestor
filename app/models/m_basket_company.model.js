const mongoose = require('mongoose');

const m_b_c = mongoose.Schema({
    basket_name: String,
    company_symbol: String
});

module.exports = mongoose.model('m_basket_company', m_b_c);