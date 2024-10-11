const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const dotenv = require('dotenv');



router.get('/transactions', transactionController.getTransactions);
// Other routes remain the same

module.exports = router;

router.get('/seed', transactionController.seedDatabase);
// router.get('/transactions', transactionController.getTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/bar-chart', transactionController.getBarChart);
router.get('/pie-chart', transactionController.getPieChart);
router.get('/combined', transactionController.getCombinedData);

module.exports = router;
