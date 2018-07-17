const mongoose = require('mongoose');

const m_b_c = mongoose.Schema({
    basket_name: String,
    company_symbol: String,
    company_name: String,
    last_sale: Number,
    pct_change: Number,
    share_volume: Number,
    points: Number
});

m_b_c.index({basket_name: 1, company_symbol: 1}, {unique: true});
module.exports = mongoose.model('m_basket_company', m_b_c);