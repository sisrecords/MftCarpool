const express = require("express");
const router = express.Router();
const sql = require("mssql");

const connectionsPool = sql.globalConnection;

router.get('/getAllRides', async (req, res) => {
    const result = await sql.query`select * from rides`;
    res.send(result.recordset[0]);
});

router.post('/addRide', async (req, res) => {
    var ownerID = req.body.ownerID;
    var fromAddress = req.body.fromAddress;
    var fromAddressLatitude = req.body.fromAddressLatitude;
    var fromAddressLongitude = req.body.fromAddressLongitude;
    var toAddress = req.body.toAddress;
    var toAddressLatitude = req.body.toAddressLatitude;
    var toAddressLongitude = req.body.toAddressLongitude;
    var date = req.body.date;
    var time = req.body.time;
    var isAvailable = req.body.isAvailable;
    var isActive = req.body.isActive;
    var rideTypeID = req.body.rideTypeID;
    let result = await connectionsPool.request()
        .input("ownerID", sql.Int, ownerID)
        .input("fromAddress", sql.NVarChar, fromAddress)
        .input("fromAddressLatitude", sql.Decimal(18, 10), fromAddressLatitude)
        .input("fromAddressLongitude", sql.Decimal(18, 10), fromAddressLongitude)
        .input("toAddress", sql.NVarChar, toAddress)
        .input("toAddressLatitude", sql.Decimal(18, 10), toAddressLatitude)
        .input("toAddressLongitude", sql.Decimal(18, 10), toAddressLongitude)
        .input("date", sql.DateTime, date)
        .input("time", sql.NVarChar, time)
        .input("isAvailable", sql.Bit, isAvailable)
        .input("isActive", sql.Bit, isActive)
        .input("rideTypeID", sql.Int, rideTypeID)
        .query(`insert into rides values(@ownerID, @fromAddress, @fromAddressLatitude, @fromAddressLongitude
            , @toAddress, @toAddressLatitude, @toAddressLongitude, @date, @time, @isAvailable, @isActive,
            @rideTypeID) SELECT SCOPE_IDENTITY()`);
    res.send(result);
});

router.post('/updateRide', async (req, res) => {
    var rideID = req.body.rideID;
    var ownerID = req.body.ownerID;
    var fromAddress = req.body.fromAddress;
    var fromAddressLatitude = req.body.fromAddressLatitude;
    var fromAddressLongitude = req.body.fromAddressLongitude;
    var toAddress = req.body.toAddress;
    var toAddressLatitude = req.body.toAddressLatitude;
    var toAddressLongitude = req.body.toAddressLongitude;
    var date = req.body.date;
    var time = req.body.time;
    var isAvailable = req.body.isAvailable;
    var isActive = req.body.isActive;
    var rideTypeID = req.body.rideTypeID;
    let result = await connectionsPool.request()
        .input("rideID", sql.Int, rideID)
        .input("ownerID", sql.Int, ownerID)
        .input("fromAddress", sql.NVarChar, fromAddress)
        .input("fromAddressLatitude", sql.Decimal(18, 10), fromAddressLatitude)
        .input("fromAddressLongitude", sql.Decimal(18, 10), fromAddressLongitude)
        .input("toAddress", sql.NVarChar, toAddress)
        .input("toAddressLatitude", sql.Decimal(18, 10), toAddressLatitude)
        .input("toAddressLongitude", sql.Decimal(18, 10), toAddressLongitude)
        .input("date", sql.DateTime, date)
        .input("time", sql.NVarChar, time)
        .input("isAvailable", sql.Bit, isAvailable)
        .input("isActive", sql.Bit, isActive)
        .input("rideTypeID", sql.Int, rideTypeID)
        .query(`update rides set ownerID = @ownerID, fromAddress = @fromAddress, 
        fromAddressLatitude = @fromAddressLatitude, fromAddressLongitude = @fromAddressLongitude, 
        toAddress = @toAddress, toAddressLatitude = @toAddressLatitude, 
        toAddressLongitude = @toAddressLongitude, date = @date, time = @time, isAvailable = @isAvailable, 
        isActive = @isActive, rideTypeID = @rideTypeID where rideID = @rideID`);
    res.send("ride updated");
});

router.post('/deleteRide', async (req, res) => {
    let result = await connectionsPool.request()
        .input("rideID", sql.Int, req.body.rideID)
        .input("isActive", sql.Bit, false)
        .query(`update rides set isActive = @isActive where rideID = @rideID`);
    res.send("ride deleted");
});

router.post('/occupyRide', async (req, res) => {
    let result = await connectionsPool.request()
        .input("rideID", sql.Int, req.body.rideID)
        .input("isAvailable", sql.Bit, false)
        .query(`update rides set isAvailable = @isAvailable where rideID = @rideID`);
    res.send("ride occupied");
});

module.exports = router;
