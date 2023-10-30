const connectDB = require("../config/connection");
const Product = require('../models/product');
const Category = require('../controllers/categoryController');
const async = require("hbs/lib/async");
const { product } = require("./handleBarHelper");


module.exports = {

  addProduct: async (productData, imageFiles) => {
    

    return new Promise(async (resolve, reject) => {

      let imagesArray = []
      if (imageFiles && imageFiles.length > 0) {

        for (let i = 0; i < imageFiles.length; i++) {
          imagesArray.push(imageFiles[i].filename)
        }

        const products = new Product({
          Name: productData.Name,
          Category: productData.Category,
          Price: productData.Price,
          Stock: productData.Stock,
          Description: productData.Description,
          Images: imagesArray,

        })
        

        await products.save().then((productData) => {
        
          resolve(productData)
        }).catch((error) => {
       
        })

      }



    })

  

  },

  getAllProductsEvenDeleted: async () => {
    try {
      await connectDB()
      return await Product.find().sort({ date: -1 })
    } catch (error) {
      console.log(error);
    }
  },
  getFilter: async (filter, sort) => {
    try {
      const product = await Product.find(filter).sort(sort)
      return product
    } catch (error) {
      console.log(error, 'cannot find products and filter and sort');
    }
  },




 
 getAllproducts : async () => {
    try {
      await connectDB(); 
      const products = await Product.find({ Deleted: false }).exec();
      
     
      return products;
    } catch (error) {
      console.log('Failed to get products:', error);
      throw error; 
    }
  },
  
  

  getAllProductList: (callback) => {
    connectDB().then(() => {
      Product.find({ Deleted: false })
        .then((products) => {
          callback(products);
        })
        .catch((error) => {
          console.log('failed to get products', error);
          callback(null);
        })
    })
  },

  getProductById: (_id) => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.findById(_id)
          .then((product) => {
            if (product) {
              resolve(product);
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            console.log('Failed to retrieve product:', error);
            reject(error);
          });
      });
    });
  },

  updateProduct: (proId, proDetails) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, proDetails, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                resolve(updatedProduct);
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },

  softDeleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, { Deleted: true }, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                resolve(updatedProduct);
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },




  recoverProduct: (proId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, { Deleted: false }, { new: true })
            .then((recoveredProduct) => {
              if (recoveredProduct) {
                resolve(recoveredProduct);
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.log('Failed to recover product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },

  getFilterName: async (filter,sort) => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find(filter).sort(sort)
          .then((products) => {
            resolve(products);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      });
    });
  },

  checkStock : async (userId)=>{
    try {
       await connectDB()

       const products = await Cart.findOne({user:userId})
     
       const cartProducts = products.products
       for(const cartProduct of cartProducts){
        const productId = cartProduct.item;
        const product = await Product.findOne({_id:productId})
    
        if(product.Stock < cartProduct.quantity){
           return ({status:false})
        }
       }
       return ({status:true})
    } catch (error) {
      console.log(error);
      return ({status:false})
    }
  }
};

