const axios = require('axios');
const Transaction = require('../models/Transaction');

// Function to fetch and seed the database with initial data from the third-party API
exports.seedDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Clear the existing data
    await Transaction.deleteMany({});
    
    // Insert the fetched data
    await Transaction.insertMany(transactions);
    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error });
  }
};

// List all transactions with search and pagination
// exports.getTransactions = async (req, res) => {
//   const { search = '', page = 1, perPage = 10 } = req.query;
  
//   const query = {
//     $or: [
//       { title: { $regex: search, $options: 'i' } },
//       { description: { $regex: search, $options: 'i' } },
//       { price: { $regex: search, $options: 'i' } },
//     ]
//   };

//   try {
//     const transactions = await Transaction.find(query)
//       .skip((page - 1) * perPage)
//       .limit(parseInt(perPage));
    
//     res.status(200).json(transactions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching transactions', error });
//   }
// };

exports.getTransactions = async (req, res) => {
  const { month, search, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
      let query = { month: month };

      // Apply search filter if search text is provided
      if (search) {
          query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
      }

      const transactions = await Transaction.find(query)
          .skip(skip)
          .limit(parseInt(limit));

      const totalTransactions = await Transaction.countDocuments(query);

      res.json({
          transactions,
          totalPages: Math.ceil(totalTransactions / limit),
          currentPage: parseInt(page),
      });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Statistics API for total sales, sold, and unsold items
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const soldItemsCount = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true
    });

    const unsoldItemsCount = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      soldItemsCount,
      unsoldItemsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

// Bar chart API
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  try {
    const result = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          price: { $gte: range.min, $lt: range.max },
          dateOfSale: { $gte: startDate, $lt: endDate }
        });
        return { range: range.range, count };
      })
    );
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bar chart data', error });
  }
};

// Pie chart API
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(`2022-${parseInt(month) + 1}-01`);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pie chart data', error });
  }
};

// Combined API
exports.getCombinedData = async (req, res) => {
  try {
    const statistics = await exports.getStatistics(req, res);
    const barChart = await exports.getBarChart(req, res);
    const pieChart = await exports.getPieChart(req, res);

    res.status(200).json({
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combined data', error });
  }
};



// In your backend controller, add a console log
console.log("Fetching transactions for month:", req.query.month, "and page:", req.query.page);
console.log("Transactions data:", transactions); // Log what you're sending to the frontend
