const express = require("express");
const router = express.Router();
const sql = require("mssql");

const connectionsPool = sql.globalConnection;

router.get('/getAllUsers', async (req, res) => {
    const result = await sql.query`select * from users`;
    res.send(result.recordset);
});

router.post('/addUserOrEmailTaken', async (req, res) => {
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    var userPhoneNumber = req.body.userPhoneNumber;
    var userEmail = req.body.userEmail;
    var isActive = req.body.isActive;
    let result = await connectionsPool.request()
        .input("userName", sql.NVarChar, userName)
        .input("userPassword", sql.NVarChar, userPassword)
        .input("userPhoneNumber", sql.NVarChar, userPhoneNumber)
        .input("userEmail", sql.NVarChar, userEmail)
        .input("isActive", sql.Bit, isActive)
        .execute("addUserOrEmailTaken");
    res.send(result);
});

router.post('/updateUser', async (req, res) => {
    var userID = req.body.userID;
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    var userPhoneNumber = req.body.userPhoneNumber;
    var userEmail = req.body.userEmail;
    var isActive = req.body.isActive;
    let result = await connectionsPool.request()
        .input("userID", sql.Int, userID)
        .input("userName", sql.NVarChar, userName)
        .input("userPassword", sql.NVarChar, userPassword)
        .input("userPhoneNumber", sql.NVarChar, userPhoneNumber)
        .input("userEmail", sql.NVarChar, userEmail)
        .input("isActive", sql.Bit, isActive)
        .query(`update users set userName = @userName, userPassword = @userPassword,
        userPhoneNumber = @userPhoneNumber, userEmail = @userEmail, 
        isActive = @isActive where userID = @userID`);
    res.send("user updated");
});

router.post('/deleteUser', async (req, res) => {
    let result = await connectionsPool.request()
        .input("userID", sql.Int, req.body.userID)
        .input("isActive", sql.Bit, false)
        .query(`update users set isActive = @isActive where userID = @userID`);
    res.send("user deleted");
});

router.get('/authUser/:userEmail/:userPassword', async (req, res) => {
    try {
        var rideID = req.params.rideID;
        let result = await connectionsPool.request()
            .input("userEmail", sql.NVarChar, req.params.userEmail)
            .input("userPassword", sql.NVarChar, req.params.userPassword)
            .input("isActive", sql.Bit, true)
            .query(`select * from users where userEmail = @userEmail AND userPassword = @userPassword
                AND isActive = @isActive`);
        res.send(result.recordset);
    }
    catch (ex) {
        res.send("");
    }
});

module.exports = router;
