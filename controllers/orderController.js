const orderHelpler = require('../helpers/orderHelper')
const cartHelper = require('../helpers/cartHelper')
const profileHelper = require('../helpers/profileHelper')
const User=require('../models/user')
const Cart=require('../models/cartModel')
const async = require('hbs/lib/async')
const { Reject } = require('twilio/lib/twiml/VoiceResponse')
const { response } = require('express')
const { deleteAddress } = require('./profileController')
const Order=require('../models/orderModel')
const { format } = require('date-fns');
const couponHelper = require('../helpers/couponHelper')
const walletHelper = require ('../helpers/walletHelper')
const Wallet = require('../models/wallerModel')
const user = require('../models/user')
const Product = require('../models/product')
const Mongodb = require('mongodb')
const orderModel = require('../models/orderModel')
const productHelper= require("../helpers/product-helpers")
const { default: mongoose } = require('mongoose')


const checkStock = async (req, res) => {
    try {
      const response = await productHelper.checkStock(req.session.user._id);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.json({ status: false, error: "An error occurred while checking stock." });
    }
  };
  



const placeOrder = async(req,res)=>{
    console.log(req.body)
    try {
        const userId=req.session.user._id;
      const cart = await Cart.findOne({user:userId})
      const coupons = await couponHelper.adminGetAllCoupons()

      
        const promises = [

            cartHelper.getTotal(req.session.user._id),
            cartHelper.getSubTotal(req.session.user._id),
            orderHelpler.getAddress(req.session.user._id),
            cartHelper.getCartProducts(req.session.user._id),
            walletHelper.getWallet(req.session.user._id)
            
            
           

        ];

        Promise.all(promises).then(([total,subTotal,address,cartItems,wallet])=>{
           
           if(address.length){
            res.render('user/checkOut',{total,subTotal,address,cartItems,wallet,cart,coupons})
           }else{
            console.log('no address');
              res.render('user/checkOut',{Noaddress:true,total,subTotal,wallet,cart,coupons})
           }
           

        })
        .catch((error)=>{
            console.log('error loading checkOut',error);
            
        })
    } catch (error) {
        console.log(error);
    }
}


const checkOut = async (req, res) => {
    try {

          
        const userId = req.session.user._id;

        const user = await User.findById(userId);
        
        const cart = await Cart.findOne({ user: userId })

        if(req.body.isWalletUsed){
            const wallet = await Wallet.findOneAndUpdate({userId:user._id},{balance:0})
           
        }
     
       


        const a = req.body;
        const total = req.body.total
      const {discount}=req.body
      console.log(discount)
      
        const order = new Order({

            createdOn: Date.now(),
            totalPrice: total-discount,
            products: cart.products,
            userId: userId,
            payment: a.paymentMethod,
            address: a.addressId,
            status: 'pending',
           
            
        })


        const saveOrder = await order.save()
        const deleteCart = await Cart.findOneAndDelete({user:userId})
        

        req.session.order_id=saveOrder._id;

      



        if (saveOrder.payment == 'COD') {
            console.log('yes iam the cod methord');
            res.json({ payment: true, method: "COD", order: saveOrder });

        } else if (saveOrder.payment == 'ONLINE') {
            console.log('yes iam the razorpay methord');

            const generatedOrder = await orderHelpler.generateOrderRazorpay(saveOrder._id, saveOrder.totalPrice);
            console.log(generatedOrder,'generatedOrder')
            res.json({ payment: false, method: "ONLINE", razorpayOrder: generatedOrder, order: saveOrder });
        }else{
            console.log("gjgf");
            res.json(false);
        }




    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPlaced', error);

    }
    


 
 const verifyPayment=async(req,res)=>{
    try {
       
        verifyOrderPayment(req.body)
        res.json({ status: true });
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function verifyPayment',error); 
        
    }
}


const verifyOrderPayment = (details) => {
        console.log("DETAILS : " + JSON.stringify(details));
        return new Promise((resolve, reject) => { 
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRETKEY)
            hmac.update(details.razorpay_order_id + '|' + details.razorpay_payment_id);
            hmac = hmac.digest('hex');
            if (hmac == details.razorpay_signature) {
                console.log("Verify SUCCESS");
                resolve();
            } else {
                console.log("Verify FAILED");
                reject();
            }
     })
    };




   
    
   
} 
const getAllOrders =async(req,res)=>{
    try {
        const orders = await orderHelpler.allOrders()
        orders.sort((a, b) => b.createdOn - a.createdOn);
        console.log(orders);
        res.render('admin-order',{orders})
    } catch (error) {
        console.log(error,'no orders')
    }
}
const getOrderDetails = async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await orderHelpler.getOrderDetails(orderId)
        console.log(order,'orderDetails');
        res.render('admin-order',{order})
    } catch (error) {
        console.log(error);
    }
}

const varifyPayments = (req,res)=>{
    console.log(req.body,'verifypayment is here');
    orderHelpler.verifyPayment(req.body).then(async()=>{
        console.log(req.body.order.response.receipt,'chkkk receipt');
        await orderHelpler.changePaymentStatus(req.body,response,receipt).then(()=>{
            res.json({status:true})
        })
    }).catch((error)=>{
        console.log(error);
        res.json({status:'payment failed'})
    })
}

const successOrder= async (req,res)=>{
    try {
        res.render('user/orderPlaced')
        
    } catch (error) {
        console.log('this is error in successOrder',error);
    }
}

const orderDetails = async (req, res) => {
    try {
        const userId = req.session.user._id; 
        
         

        const itemsPerPage = 5;
        const currentpage = parseInt(req.query.page) || 1;

     
        const orders = await Order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                },
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: 'products',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
        ]);

       
        orders.forEach(order => {
            let walletDeduction = 0;
          
            if (order.walletUsed) {
                walletDeduction = order.walletAmount;
            }
            order.actualOrderTotal = order.totalPrice - walletDeduction;
        });

        orders.sort((a, b) => b.createdOn - a.createdOn);



        
        const startIndex = (currentpage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalpages = Math.ceil(orders.length / itemsPerPage);
        const pages = Array.from({ length: totalpages }, (_, i) => i + 1);

        const currentOrders = orders.slice(startIndex, endIndex);

        res.render('user/orderDetails', {
            orders: currentOrders,
            currentpage,
            totalpages,
            pages,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/login');
    }
};

  

const cancelOrder = async (req, res) => {
    try {
      const orderId = req.query.id
      console.log('this sihh  the order',orderId);
      const updatedOrder = await orderHelpler.cancelOrder(orderId)
  

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
         res.json({status:true});
     
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const adminOrderDtails = async (req, res) => {
    try {

      const orders = await Order.find({}).sort({ createdOn: -1 }).populate('products.item');
     

        const products = await Product.find();
        const itemsPerPage = 5;
        const currentpage = parseInt(req.query.page) || 1;
        const startIndex = (currentpage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalpages = Math.ceil(orders.length / itemsPerPage);
        const pages = Array.from({ length: totalpages }, (_, i) => i + 1);
        const currentproduct = orders.slice(startIndex, endIndex);
        
        console.log(orders[0].products,"ods");
      
        res.render('admin/adminOrderDetails',{ orders:currentproduct,pages,currentpage,totalpages,products });
    } catch (error) {
        console.log('order not found', error);
    }
}

const statusUpdateOrder = async(req,res)=>{
    try {
        const userId = req.params.userId
        const newStatus = req.body.status;
        await Order.findByIdAndUpdate(userId,{status:newStatus })
        res.json({status:true})
    } catch (error) {
        res.status(500).json({ status: false, error: 'Failed to update order status' });
    }
}
const adminOrderDetails = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const oid = new Mongodb.ObjectId(orderId)
  
    let orders = await Order.aggregate([
        {$match:{_id:oid}},
        {$unwind:'$products'},
      
        {$lookup:{
            from:'products',
            localField:'products.item', 
            foreignField:'_id',
            as:'ProductDetails',
        }},

    ])

 
      if (!orders) {
        console.log('Order not found');
        res.redirect('/admin-orderList');
      } else {
        res.render('admin/adminSingleProductDetails', { orders });
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  



const ChangeStatusDelivered=async(req,res)=>{
    try {
        
const id=req.query.id;
console.log('this is id ',id);

const ordeData= await Order.findByIdAndUpdate(id,{
    status:"Delivered"
},{new:true})
console.log(ordeData,"????");

res.redirect('/admin/admin-orderList')


    } catch (error) {
        console.log('this error hapence in ChangeStatusDelivered',error);
    }
}

const ChangeStatuscancelled = async (req, res) => {
    try {
        const id = req.query.id;

        const orderData = await Order.findById(id);
        orderData.status = 'Cancelled';
        await orderData.save();

        const userId = orderData.userId;

        if (orderData.payment === 'ONLINE' || orderData.payment === 'Wallet') {
            const wallet = await Wallet.findOne({ userId: userId });

            if (wallet) {
                wallet.history.push({
                    description: 'refund for product',
                    price: orderData.totalPrice
                });
                wallet.balance += orderData.totalPrice;
                await wallet.save();
            } else {
                await Wallet.create({
                    userId: userId,
                    balance: orderData.totalPrice,
                    history: {
                        description: 'refund for product',
                        price: orderData.totalPrice
                    }
                });
            }
        }

        console.log('Order data for Cancelled status:', orderData);
        res.redirect('/admin/admin-orderList');
    } catch (error) {
        console.log('Error in ChangeStatusCancelled:', error);
    }
};

const ChangeStatusShipped = async(req,res)=>{
    try {
        const id = req.query.id
        const orderData = await Order.findByIdAndUpdate(id,{status:'Shipped'},{new:true})
        console.log(orderData,'this is orderData=====');
       
       
        res.redirect('/admin/admin-orderList')
    } catch (error) {
        console.log('this error happence in ChangeStatusShipped',error);
    }
}
const ChangeStatusReturned = async(req,res)=>{
    try {
        const id = req.query.id
       

        const orderData =await Order.findById(id)
        orderData.status='Returned'
       await orderData.save()
        const userId = orderData.userId
        if(orderData.payment == 'ONLINE'|| orderData.payment =='Wallet'){
         const wallet = await Wallet.findOne({userId:userId})
         if(wallet){
            wallet.history.push({
                description:'refund for product',
                price:orderData.totalPrice
            })
            wallet.balance += orderData.totalPrice
             await wallet.save() 
         }else{
          await  wallet.create({
                userId:userId,
                balance:orderData.totalPrice,
                history:{
                    description:'refund for product',
                    price:orderData.totalPrice
                }
            })
         }
        }
        console.log('this is order data',orderData);
        res.redirect('/admin/admin-orderList')
    } catch (error) {
        console.log('error happening in retruned status',error);
    }
}

module.exports = {
    placeOrder,
    checkOut,
    getAllOrders,
    getOrderDetails,
    varifyPayments,
    successOrder,
    orderDetails,
    cancelOrder,
    adminOrderDtails,
    statusUpdateOrder,
    adminOrderDetails,
    ChangeStatusDelivered,
    ChangeStatusShipped,
    ChangeStatusReturned,
    ChangeStatuscancelled,
    checkStock
    
}