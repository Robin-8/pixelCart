const Order = require('../models/orderModel')
const connectDB = require('../config/connection')
const Product = require('../models/product')
const Category = require('../models/categoryModel')


const getOrdertotal = async () => {
 
    try {
  
  
      const data = await Order.aggregate([
        {
          $match: {
            "status": "Delivered"  
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
            status: "Delivered", 
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdOn", 
              },
            },
            dailySales: {
              $sum: "$totalPrice", 
            },
          },
        },
        {
          $sort: {
            _id: 1, 
          },
        },
      ]);
      return data;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }

  const salesCount = async () => {
    try {
        await connectDB()     
      const data = await Order.aggregate([
        {
          $match: {
            "status": "Delivered", 
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdOn", 
              },
            },
            orderCount: { $sum: 1 } 
          },
        },
        {
          $sort: {
            _id: 1 
          }
        }
      ]);
      return data;
    } catch (error) {
      console.log(error);
      throw error; 
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
      throw error; 
    }
  }

  const onlineCount = async () => {
    try {
     
        await connectDB()
      const data = await Order.aggregate([
        {
          $match: {
            payment: "ONLINE",
            status: "Delivered", 
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: "$totalPrice" }, 
            count: { $sum: 1 },
          },
        },
      ]);
  
      return data;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }

  const codCount = async () => {
    try {
      await connectDB(); 
  
      const data = await Order.aggregate([
        {
          $match: {
            payment: 'COD',
            status: 'Delivered' 
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
      throw error; 
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
      throw error; 
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
  