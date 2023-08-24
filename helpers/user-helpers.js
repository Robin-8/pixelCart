const bcrypt = require("bcrypt")
const connectDB = require("../config/connection");
const User = require('../models/user');


module.exports = {
	
	addUser: async(user, callback) => {
		const userData = {
			name: user.name,
			email: user.email,
			mobile: user.mobile,
			password: user.password
		};
		console.log(user);
		userData.password = await bcrypt.hash(user.password, 10);
		connectDB().then(() => {
			User.create(userData)
			.then(() => {
				callback("DONE");
			})
			.catch((e) => {
				console.log(e);
				callback("FAILED");
			});
		});
	},

	getUserById: (_id) => {
		return new Promise((resolve, reject) => {
			connectDB().then(() => {
				console.log(_id);
				User.findById(_id) 
				.then((user) => {
					if (user) {
						resolve(user);
					} else {
						resolve(null);
					}
				})
				.catch((error) => {
					console.log('Failed to retrieve user:', error);
					reject(error);
				});
			});
		});
	},

	updateUserBlockedStatus: (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
			.then(() => {
				User.findByIdAndUpdate(userId, { Blocked: true }, { new: true })
				.then((updatedUser) => {
					if (updatedUser) {
						resolve(updatedUser);
					} else {
						resolve(null);
					}
				})
				.catch((error) => {
					console.log('Failed to update user:', error);
					reject(error);
				});
			})
			.catch((error) => {
				console.log('Failed to connect to the database:', error);
				reject(error);
			});
		});
	},

	updateUserUnBlockedStatus: (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
			.then(() => {
				User.findByIdAndUpdate(userId, { Blocked: false }, { new: true })
				.then((updatedUser) => {
					if (updatedUser) {
						resolve(updatedUser);
					} else {
						resolve(null);
					}
				})
				.catch((error) => {
					console.log('Failed to update user:', error);
					reject(error);
				});
			})
			.catch((error) => {
				console.log('Failed to connect to the database:', error);
				reject(error);
			});
		});
	},

	deleteUserById: (_id) => {
		return new Promise((resolve, reject) => {
			connectDB().then(() => {
				User.findByIdAndDelete(_id)
				.then((deletedUser) => {
					if (deletedUser) {
						resolve(deletedUser);
					} else {
						resolve(null);
					}
				})
				.catch((error) => {
					console.log('Failed to delete user:', error);
					reject(error);
				});
			});
		});
	},
	









	getAdminByMail: (email) => {
		return new Promise((resolve, reject) => {
			const Email = email.email
			const password = email.password
			connectDB()
			.then(() => {
				User.findOne({email: Email})
				.then((admin) => {
					if (admin) {
						bcrypt.compare(password, admin.password, (err, result) => {
							if (err) {
								console.log('Password comparison error:', err);
								reject(err);
							}
							if (result) {
								resolve(admin);
							} else {
								resolve(null);
							}
						});
					} else {
					resolve(null);
					}
				})
				.catch((error) => {
					console.log('Failed to retrieve admin:', error);
					reject(error);
				});
			});
		});
	}
}

module.exports.getUsers = (data) => {
	return new Promise((resolve, reject) => {
    	connectDB()
    	.then( () => {
    		User.find({ email: data.email })
        	.then((user) => {
            	if (user) {
					bcrypt.compare(data.password, user[0].password)
					.then((isMatch) => {
						if (isMatch) {
						resolve(user);
						} else {
						resolve(null);
						}
					})
					.catch((error) => {
						console.log('Error comparing passwords:', error);
						reject(error);
					});
            	} else {
            		resolve(null);
            	}
        	})
        	.catch((error) => {
            	console.log('Failed to retrieve users:', error);
            	reject(error);
        	});
    	})
    	.catch((error) => {
			console.log('Failed to connect to the database:', error);
			reject(error);
    	});
	});
};

module.exports.getAllUsers = () => {	
	return new Promise((resolve, reject) => {
		connectDB()
		.then(() => {
			User.find({})
        	.then( (user) => {
				console.log(user);
				resolve(user);
            })
        	.catch((error) => {
				console.log('Failed to retrieve users:', error);
				reject(error);
        	});
    	})
    	.catch((error) => {
			console.log('Failed to connect to the database:', error);
			reject(error);
    	});
	});
};