const UserModel = require('../models/User');

class UserDao {
    constructor() { }

    addNew(obj) {
        return new Promise((resolve, reject) => {
            let newUser = new UserModel(obj);
            newUser.save((err, savedUser) => {
                if (err) {
                    reject(err);
                }
                savedUser.password = '************';
                resolve(savedUser);
            });
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            UserModel.findById(id, { password: 0 }, (err, singleUser) => {
                if (err) {
                    reject(err);
                }
                resolve(singleUser);
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            UserModel.find({}, { password: 0 }, (err, usersArray) => { 
                if (err) {
                    reject(err);
                }
                resolve(usersArray);
            });
        });
    }

    getOneByEmail(email) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email }, (err, singleUser) => { //password included here
                if (err) {
                    reject(err);
                }
                resolve(singleUser);
            });
        });
    }

    update(password, fname, email, lname, id, phone) {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndUpdate(id, { $set: { password, fname, email, lname, id, phone } }, { new: true }, (err, result) => {
                if (err) {
                    reject(err);
                }
                result.password = '***********';
                resolve(result);
            });
        });
    }

    del(id) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndDelete(id, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve('User Deleted Successfully!');
            });
        });
    }
    delAll() {
        return new Promise((resolve, reject) => {
            UserModel.deleteMany({}, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve('Users Deleted Successfully!');
            });
        });
    }
}

module.exports = new UserDao();