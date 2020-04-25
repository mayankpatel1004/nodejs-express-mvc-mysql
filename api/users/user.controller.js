const { create, getUserByUserId, getUsers, updateUser, deleteUser,getUserByUserEmail, excelRead, excelWrite, exportUsers } = require('./user.service');

const {genSaltSync, hashSync, compareSync} = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = {
    createUser: (req, res) => {
        const body =  req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if(err){
                if(err == 'ER_DUP_ENTRY'){
                    return res.status(500).json({
                        success: 0,
                        message: "Email address already exists on this system. Please try different email address !"
                    });
                }else {
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection error"
                    });
                }
                
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success:1,
                data: results
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success:1,
                data: results
            });
        });
    },
    excelRead : (req, res) => {
        excelRead((err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    excelWrite : (req, res) => {
        excelWrite((err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    exportUsers : (req, res) => {
        exportUsers((err, results) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    updateUsers: (req, res) => {
        const body= req.body;
        const salt = genSaltSync(10);
        //body.password = hashSync(body.password, salt);
        updateUser(body, (err,results) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Failed to update user"
                });
            }
            return res.json({
                success: 1,
                message: "Updated Successfully"
            });
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err,results) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                });
            }
            return res.json({
                success: 1,
                message: "User Deleted Successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if(err){
                console.log(err);
            }
            if(!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if(result) {
                results.password = undefined;
                const jsontoken = sign({result: results}, "qwe1234",{
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    message: "Login Successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
        });
    }
};