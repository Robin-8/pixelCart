const connectDB = require("../config/connection");
const Product = require('../models/product');

module.exports = {
  
  addProduct: (product, callback) => {
    console.log(product);
    connectDB().then(() => {
      Product.create(product)
        .then((data) => {
          console.log(data);
          callback(data._id);
        })
        .catch((error) => {
          console.log('Failed to add product:', error);
          callback(false);
        });
    });
  },

  getAllProducts: (callback) => {
    connectDB().then(() => {
      Product.find()
        .then((products) => {
          callback(products);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          callback(null);
        });
    });
  },

  getCamera_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Camera',Deleted: false })
          .then((eproducts) => {
            resolve(eproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getActionCamera_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'ActionCamera',Deleted: false })
          .then((clothproducts) => {
            resolve(clothproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getSurveillanceCamera_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'SurveillanceCamera',Deleted: false })
          .then((SurveillanceCameraproducts) => {
            resolve(SurveillanceCameraproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
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

