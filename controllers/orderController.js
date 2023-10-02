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
            product: cart.products,
            userId: userId,
            payment: a.paymentMethod,
            address: a.addressId,
            status: 'pending',
           
            
        })

        const saveOrder = await order.save()
      




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




   
    




    // try {
    //     console.log('body is ',req.body);
    //     const user = req.session.user

    //     let products = await cartHelper.getCartProductList(user._id)
    //     let totalPrice = await cartHelper.getTotal(user._id)
    //     let amountPaid = req.body.total;
    //     let paymentMethod=req.body.paymentMethod;

    //     let delivaryAddress = await profileHelper.fetchPrimaryAddress(req.session.user._id,req.body.addressId)
    //     console.log(delivaryAddress,"add");
    //     let obj={
    //         products:products,
    //         totalPrice:totalPrice,
    //         amountPaid:amountPaid,
    //         paymentMethod:paymentMethod,
    //         delivaryAddress:delivaryAddress,
    //         user_Id:user._id,
    //         userName:user.lname
    //     }
    //     console.log(obj,"objj");
    //    // await orderHelpler.placeOrder(paymentMethod,products,totalPrice,amountPaid,delivaryAddress,user._id,user.Name).then(async(orderId)=>{
    //     await orderHelpler.placeOrder(obj).then(async(orderId)=>{
    //         console.log(orderId,"oid");

    // console.log("entr");
    //         if (req.body.paymentMethod == COD) {
    //             console.log("success");
    //             console.log('cod is her');
    //             res.json({cod:true})
    //         }
    //     })
    // } catch (error) {
    //     console.log(error);
    // }
   
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
        // Retrieve the user's orders using the getOrders function
        const userId = req.session.user._id; // Assuming you can access the user's ID from the session
        const orders = await orderHelpler.getOrders(userId);
        // context.orders.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        // Render the orderDetails view and pass the orders data
        res.render('user/orderDetails', { orders, });
    } catch (error) {
        console.log('Order details error:', error);
        // Handle errors here (e.g., render an error page or send an error response)
    }
};
const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const updatedOrder = await orderHelpler.cancelOrder(orderId)
  
      // Check if the order was successfully cancelled
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
         res.redirect('/orderDetails')
      // Send a response to indicate success
    //   res.json({ message: 'Order cancelled successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const adminOrderDtails = async (req, res) => {
    try {
        const orders = await Order.find();
        console.log(orders,"ods");
        res.render('admin/adminOrderDetails',{ orders });
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
const adminOrderDetails = async(req,res)=>{
   
    try {
        const orderId = req.params.orderId
        const order = await Order.findById(orderId).populate('products')
        // console.log(order,'order here');
        if(!order){
            console.log('order not found');
            res.redirect("/admin-orderList")
        }else{
            res.render('admin/adminSingleProductDetails',{order})
        }
    } catch (error) {
        console.log(error,'cannot find oreder');
    }
 

}




const ChangeStatusDelivered=async(req,res)=>{
    try {
        
const id=req.query.id;

const ordeData= await Order.findByIdAndUpdate(id,{
    status:"Delivered"
},{new:true})
console.log('this is order data',ordeData);

res.redirect('/admin/admin-orderList')


    } catch (error) {
        console.log('this error hapence in ChangeStatusDelivered',error);
    }
}

const ChangeStatuscancelled = async(req,res)=>{
    try {
        const id = req.query.id
        const orderData = await Order.findByIdAndUpdate(id,{status:'Cancelled'},{new:true})
        console.log('this is order data',orderData);
        res.redirect('/admin/admin-orderList')
    } catch (error) {
        console.log('this error happence in ChangeStatuseCancelled',error);
    }
}
const ChangeStatusShipped = async(req,res)=>{
    try {
        const id = req.query.id
        const orderData = await Order.findByIdAndUpdate(id,{status:'Cancelled'},{new:true})
        console.log('this is orderData',orderData);
        res.redirect('/admin/admin-orderList')
    } catch (error) {
        console.log('this error happence in ChangeStatusShipped',error);
    }
}
const ChangeStatusReturned = async(req,res)=>{
    try {
        const id = req.query.id
        const orderData =await Order.findByIdAndUpdate(id,{status:'Returned'},{new:true})
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