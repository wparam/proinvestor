const express = require('express');
const router = express.Router();

const companyCtrl = require('./company.controller');

const internalPrefix = '/api/internal';

router.get('/company/list', companyCtrl.companyList);

module.exports = router;

