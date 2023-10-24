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
        console.log('this is user data ', user);
        const cart = await Cart.findOne({ user: userId })
        console.log('this is cart', cart.products);


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

       
        console.log(saveOrder,"===========")
        



        if (saveOrder.payment == 'COD') {
            console.log('yes iam the cod methord');
            res.json({ payment: true, method: "COD", order: saveOrder });

        } else if (saveOrder.payment == 'ONLINE') {
            console.log('yes iam the razorpay methord');

            const generatedOrder = await orderHelpler.generateOrderRazorpay(saveOrder._id, saveOrder.totalPrice);
            console.log(generatedOrder,'generatedOrder')
            res.json({ payment: false, method: "ONLINE", razorpayOrder: generatedOrder, order: saveOrder });

        }




    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPlaced', error);

    }
    
 //----------------------------------------------
 
 
 
 
 
 //------------grnerate the razorpay -----------------

 
 const verifyPayment=async(req,res)=>{
    try {
       
        verifyOrderPayment(req.body)
        res.json({ status: true });
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function verifyPayment',error); 
        
    }
}
//----------------------------------------------





//---------------verify the payment  razorpay-------------------------------

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
      const userId = req.session.user._id; // Assuming you can access the user's ID from the session
    //   const orders = await orderHelpler.getOrders(userId);
    const orders = await Order.find({userId:userId})
      // Use Mongoose's populate method to populate the 'products' field in each order
    //   await Order.populate(orders, { path: 'products.product' });
  
      orders.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        
      const itemsPerPage = 5;
      const currentpage = parseInt(req.query.page) || 1;
      const startIndex = (currentpage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const totalpages = Math.ceil(orders.length / itemsPerPage);
      const pages = Array.from({ length: totalpages }, (_, i) => i + 1); // Create an array of page numbers
      const currentproduct = orders.slice(startIndex, endIndex);
        console.log("Current pages=>" , currentproduct)
      res.render('user/orderDetails', {
        orders: currentproduct,
        currentpage,
        totalpages,
        pages, // Pass the array of page numbers
      });
    } catch (error) {
      // Handle errors
      console.log(error)
      res.redirect('/login')
    }
  };
  

const cancelOrder = async (req, res) => {
    try {
      const orderId = req.query.id
      console.log('this sihh  the order',orderId);
      const updatedOrder = await orderHelpler.cancelOrder(orderId)
  
      // Check if the order was successfully cancelled
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
         res.json({status:true});
      // Send a response to indicate success
    //   res.json({ message: 'Order cancelled successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const adminOrderDtails = async (req, res) => {
    try {
       // Fetch orders in descending order of createdOn
      const orders = await Order.find({}).sort({ createdOn: -1 });

        const products = await Product.find();
        const itemsPerPage = 5;
        const currentpage = parseInt(req.query.page) || 1;
        const startIndex = (currentpage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalpages = Math.ceil(orders.length / itemsPerPage);
        const pages = Array.from({ length: totalpages }, (_, i) => i + 1); // Create an array of page numbers
        const currentproduct = orders.slice(startIndex, endIndex);
        
        console.log(orders,"ods");
      
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
    //   const order = await Order.findById(orderId).populate('products.product');
    let orders = await Order.aggregate([
        {$match:{_id:oid}},
        {$unwind:'$products'},
        // {$project:{
        //     proId:{'$toObjectId':'$products._id'},
        // }},
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
    ChangeStatuscancelled
    
}