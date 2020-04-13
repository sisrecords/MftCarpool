const express = require("express");
const router = express.Router();
const sql = require("mssql");

const connectionsPool = sql.globalConnection;

router.get('/getAllUsers', async (req, res) => {
    const result = await sql.query`select * from users`;
    res.send(result.recordset[0]);
});

router.post('/addUser', async (req, res) => {
    var userName = req.body.userName;
    var userPhoneNumber = req.body.userPhoneNumber;
    var userEmail = req.body.userEmail;
    var isActive = req.body.isActive;
    let result = await connectionsPool.request()
        .input("userName", sql.NVarChar, userName)
        .input("userPhoneNumber", sql.NVarChar, userPhoneNumber)
        .input("userEmail", sql.NVarChar, userEmail)
        .input("isActive", sql.Bit, isActive)
        .query(`insert into users values(@userFirstName, @userPhoneNumber, @userEmail
            , @isActive) SELECT SCOPE_IDENTITY()`);
    res.send(result);
});

router.post('/updateUser', async (req, res) => {
    var userID = req.body.userID;
    var userName = req.body.userName;
    var userPhoneNumber = req.body.userPhoneNumber;
    var userEmail = req.body.userEmail;
    var isActive = req.body.isActive;
    let result = await connectionsPool.request()
        .input("userID", sql.Int, userID)
        .input("userName", sql.NVarChar, userName)
        .input("userPhoneNumber", sql.NVarChar, userPhoneNumber)
        .input("userEmail", sql.NVarChar, userEmail)
        .input("isActive", sql.Bit, isActive)
        .query(`update users set userName = @userName, 
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

module.exports = router;
