const Order = require('../models/orderModel')
const connectDB = require('../config/connection')
const Product = require('../models/product')
const Category = require('../models/categoryModel')


const getOrdertotal = async () => {
    console.log('getOrdertotal at hpr');
    try {
  
  
      const data = await Order.aggregate([
        {
          $match: {
            "status": "Delivered"  // Consider only completed orders
          }
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum:  "$totalPrice" },
            count: { $sum: 1 }
          }
        }
      ]);
  
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const salesData = async () => {
    try {
         await connectDB()
      const data = await Order.aggregate([
        {
          $match: {
            status: "Delivered", // Match only delivered orders
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdOn", // Group by the date field
              },
            },
            dailySales: {
              $sum: "$totalPrice", // Calculate the daily sales using totalAmount
            },
          },
        },
        {
          $sort: {
            _id: 1, // Sort the results by date in ascending order
          },
        },
      ]);
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to indicate failure
    }
  }

  const salesCount = async () => {
    try {
        await connectDB()     
      const data = await Order.aggregate([
        {
          $match: {
            "status": "Delivered", // Match orders with "delivered" status
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdOn", // Group by the "date" field
              },
            },
            orderCount: { $sum: 1 } // Calculate the count of orders per date
          },
        },
        {
          $sort: {
            _id: 1 // Sort the results by date in ascending order
          }
        }
      ]);
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to indicate failure
    }
  }

  const productsCount = async () => {
    try {
        await connectDB()
      await connectDB();
      const data = await Product.find({}).count();
      
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to indicate failure
    }
  }

  const onlineCount = async () => {
    try {
     
        await connectDB()
      const data = await Order.aggregate([
        {
          $match: {
            payment: "ONLINE",
            status: "Delivered", // Use lowercase for status based on the enum values
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: "$totalPrice" }, // Assuming totalAmount contains the price for each product
            count: { $sum: 1 },
          },
        },
      ]);
  
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error if needed
    }
  }

  const codCount = async () => {
    try {
      await connectDB(); // Assuming connectDB returns a promise
  
      const data = await Order.aggregate([
        {
          $match: {
            payment: 'COD',
            status: 'Delivered' // Use lowercase for status based on the enum values
          }
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$totalPrice' },
            count: { $sum: 1 }
          }
        }
      ]);
  
      return data;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error if needed
    }
  }

  const totalSaleToday = async () => {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
  
      const data = await Order.aggregate([
        {
          $match: { 
            "createdOn": {
              $gte: yesterday,
              $lte: currentDate
            }
          }
        }
      ]);
      console.log(data,'data here');
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error to indicate failure
    }
  };

  const totolCatgorySale = async()=>{
    try {
      
      await connectDB()
      const data = await Category.aggregate([

        {
          $match: {
            name: { $in: ["Sony", "Cannon"] }, 
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,   
            count: { $sum: 1 }  
          }
        }
        
      ])
      console.log(data,'data hererrrrrrrr');
      return data;
      
    } catch (error) {
      
    }
  }
  
  
  

 
  
  
  

  module.exports ={
    getOrdertotal,
    salesData,
    salesCount,
    productsCount,
    onlineCount,
    codCount ,
    totalSaleToday,
    totolCatgorySale
  }
  