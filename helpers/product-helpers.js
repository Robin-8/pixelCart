const connectDB = require("../config/connection");
const Product = require('../models/product');

module.exports = {
  
  addProduct: (productData, imageFiles) => {
         console.log(productData,'//////////');
         console.log(imageFiles,'******');
    return new Promise(async(resolve,reject)=>{

            let imagesArray =[]
            if(imageFiles && imageFiles.length > 0){

              for(let i=0;i<imageFiles.length ;i++){
                imagesArray.push(imageFiles[i].filename)
              }

              const products = new Product({
               Name:productData.Name,
               Category:productData.Category,
               Price:productData.Price,
               Stock:productData.Stock,
               Description:productData.Description,
               Images:imagesArray,

              })
              console.log(products,"pdsss");

            await products.save().then((productData)=>{
              console.log(productData,"pdsaaa");
              resolve(productData)
            }).catch((error)=>{
              console.log(error,'///////////');
            })
          
            }
            
            
            
    })
    
    
    
  },

  // getAllProducts: (callback) => {
  //   connectDB().then(() => {
  //     Product.find()
  //       .then((products) => {
  //         callback(products);
  //       })
  //       .catch((error) => {
  //         console.log('Failed to get products:', error);
  //         callback(null);
  //       });
  //   });
  // },
  getAllproducts: (callback) => {
    connectDB().then(() => {
      Product.find({ Deleted: false }) 
        .then((products) => {
          callback(products);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          callback(null);
        });
    });
  },
  
  getProductById:(_id)=> {
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
          Product.findByIdAndUpdate(proId, { Deleted:true }, { new: true })
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
}
};

