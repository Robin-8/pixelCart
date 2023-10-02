const mongoose = require('mongoose')
const User = require('../models/user')
const Cart = require('../models/cartModel')
const product = require('../models/product')
const connectDB = require('../config/connection')
const async = require('hbs/lib/async')
const { response } = require('express')
const { error } = require('console')
const { rejects } = require('assert')
const Order = require('../models/orderModel')
const Razorpay=require('razorpay')
var instance = new Razorpay({ key_id:"rzp_test_pGz4qvobcKcY0w", key_secret: "pH1BfIUA8rp2D33YqG0OOYQJ" })

const getAddress = async (userId) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                User.findById(userId).then((data) => {
                    const address = data.Address
                    resolve(address)
                }).catch((erorr) => {
                    console.log(erorr, 'getAddressErorr');
                    reject(erorr)
                })
            })
    })
}

//const placeOrder = async (paymentMethod,data, products, total, user_Id, userName,amountPaid) => {
const placeOrder = async (obj) => {
    const { paymentMethod, user_Id,
        delivaryAddress, amountPaid, products } = obj

    return new Promise((resolve, reject) => {

        console.log(details)

        const status = paymentMethod === 'COD' ? 'places' : 'Pending'

        const productsWithQuantity = products.map(product => {
            return {
                product: product.item,
                quantity: product.quantity,
            };
        });
        const orderObj = {

            delivaryDetails: {
                fname: details.fname,
                lname: details.lname,
                address1: details.address1,
                address2: details.address2,
                towncity: details.towncity,
                pincode: details.pincode,
                email: details.email,
                mobile: details.mobile,


            },

            userName: userName,
            userId: user_Id,
            paymentMethod: data['paymentMethod'],
            totalamount: total,
            amountPaid: amountPaid,
            status: status,
            products: productsWithQuantity,
            date: new Date()

        }
        connectDB()


            .then(async () => {
                let cartId
                await Order.create(orderObj).then(async (response) => {
                    cartId = response._id
                    const deleteResult = await Cart.deleteOne({ user: user_Id })
                    resolve(cartId)
                }).then(async (response) => {
                    const Products = await Cart.findOne({ _id: cartId })
                        .populate(products.product)

                    Products.products.map(async (item) => {
                        let stock = item.products.Stock - item.products.quantity
                        await Products.findByIdAndUpdate(item.product._id), { Stock: stock }, { new: true }
                    })


                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })
}

const allOrders = async () => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.find({}).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })
}


const getOrderDetails = async (orderId) => {
    console.log('chkkkk getOrderDetails hlprrrrrrrr');
    try {
        const orders = await Order.findById(orderId)
            .populate('products.product')
            .populate('userId')
            .exec();

        if (!orders) {
            throw new Error('Order not found'); // Handle the case when the order is not found
        }

        return orders;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = getOrderDetails;

const getOrderCount = async (userId) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.find({ userId: userId }).then((order) => {
                    const orderCount = order.length
                    resolve(orderCount)
                    console.log(orderCount, 'show the order count');
                }).catch((err) => {
                    resolve(err, 'order not found')
                })
            })
    })
}
const getOrders = async (userId) => {
    return new Promise((resolve, reject) => {
        
        connectDB()
            .then(async () => {
                const orders = await Order.find({ userId: userId })
                    .populate('products.product') // Populate the 'product' field within the 'products' array
                    .exec()
                    .then((data) => {
                        
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
            })
    })
}
const updateDeliveryStatus = async (details) => {
    const status = details.status;
    const orderId = details.orderId.trim()
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.findByIdAndUpdate(orderId, { status: status }).then(() => {
                    resolve({ updated: true })
                }).catch((error) => {
                    reject(error)
                })
            })
    })

}
const verifyPayment = async (details) => {
    console.log(details, 'checking details');
    console.log("verifying payment...");

    return new Promise(async (resolve, reject) => {
        if (details.payment.method === 'COD') {
            // Handle COD payment here
            console.log("Cash on Delivery payment accepted.");
            resolve();
        } else {
            // For other payment methods, perform your existing verification logic
            const crypto = require('crypto');
            let hmac = await crypto.createHmac('sha256', 'pH1BfIUA8rp2D33YqG0OOYQJ');
            hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
            hmac = hmac.digest('hex');
            console.log(hmac, 'checking hmac');

            if (hmac === details.payment.razorpay_signature) {
                console.log("Payment verified.");
                resolve();
            } else {
                console.log("Payment rejected.");
                reject();
            }
        }
    });
};
const changePaymentStatus = async((userId) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.findByIdAndUpdate(userId,{$set: { status: 'placed' }})
                    .then(() => {
                        console.log("status is changed");
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
            })
    })
})

const cancelOrder = async (orderId) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: 'Cancelled' } },
            { new: true }
        );

        if (!updatedOrder) {
            throw new Error('Order not found');
        }

        return updatedOrder;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    cancelOrder,
};

const getOrder = async (orderId) => {
    return new Promise((resolve, rejects) => {
        connectDB()
            .then(() => {
                Order.findById(orderId).then((order) => {
                    console.log(order, 'order here');
                    resolve(order)
                }).catch((error) => {
                    rejects(error)
                })
            })
    })
}

const generateOrderRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {
        console.log(typeof orderId,typeof total, orderId, total)
        const options = {
            amount: total * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+orderId
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log("failed");
                console.log(err);
                reject(err);
            } else {
                resolve(order);
            }
        });
    })
}


module.exports = {
    getAddress,
    placeOrder,
    allOrders,
    getOrderDetails,
    getOrderCount,
    getOrders,
    updateDeliveryStatus,
    verifyPayment,
    changePaymentStatus,
    cancelOrder,
    getOrder,
    generateOrderRazorpay
}