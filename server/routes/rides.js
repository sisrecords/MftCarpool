const express = require("express");
const router = express.Router();
const sql = require("mssql");
const nodemailer = require("nodemailer");

const connectionsPool = sql.globalConnection;
const transporter = nodemailer.transporter;

const OFFER_RIDE_ID = 1;
const REQUEST_RIDE_ID = 2;

router.get('/getAllRides', async (req, res) => {
    const result = await sql.query`select * from rides where isActive = 'true'`;
    res.send(result.recordset);
});

router.get('/getRide/:rideID', async (req, res) => {
    try {
        var rideID = req.params.rideID;
        let result = await connectionsPool.request()
            .input("rideID", sql.Int, rideID)
            .query(`select * from rides where rideID = @rideID`);
        res.send(result.recordset[0]);
    }
    catch (ex) {
        res.send("");
    }
});

router.post('/addRide', async (req, res) => {
    var ownerName = req.body.ownerName;
    var ownerPhoneNumber = req.body.ownerPhoneNumber;
    var ownerEmail = req.body.ownerEmail;
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
    var chosenUserID = req.body.chosenUserID;
    let result = await connectionsPool.request()
        .input("ownerName", sql.NVarChar, ownerName)
        .input("ownerPhoneNumber", sql.NVarChar, ownerPhoneNumber)
        .input("ownerEmail", sql.NVarChar, ownerEmail)
        .input("fromAddress", sql.NVarChar, fromAddress)
        .input("fromAddressLatitude", sql.Decimal(18, 10), fromAddressLatitude)
        .input("fromAddressLongitude", sql.Decimal(18, 10), fromAddressLongitude)
        .input("toAddress", sql.NVarChar, toAddress)
        .input("toAddressLatitude", sql.Decimal(18, 10), toAddressLatitude)
        .input("toAddressLongitude", sql.Decimal(18, 10), toAddressLongitude)
        .input("date", sql.NVarChar, date)
        .input("time", sql.NVarChar, time)
        .input("isAvailable", sql.Bit, isAvailable)
        .input("isActive", sql.Bit, isActive)
        .input("rideTypeID", sql.Int, rideTypeID)
        .input("chosenUserID", sql.Int, chosenUserID)
        .query(`insert into rides values(@ownerName, @ownerPhoneNumber, @ownerEmail, @fromAddress, @fromAddressLatitude, @fromAddressLongitude
            , @toAddress, @toAddressLatitude, @toAddressLongitude, @date, @time, @isAvailable, @isActive,
            @rideTypeID, @chosenUserID) SELECT SCOPE_IDENTITY()`);
    res.send(result);
});

router.post('/updateRide', async (req, res) => {
    var rideID = req.body.rideID;
    var ownerName = req.body.ownerName;
    var ownerPhoneNumber = req.body.ownerPhoneNumber;
    var ownerEmail = req.body.ownerEmail;
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
    var chosenUserID = req.body.chosenUserID;
    let result = await connectionsPool.request()
        .input("rideID", sql.Int, rideID)
        .input("ownerName", sql.NVarChar, ownerName)
        .input("ownerPhoneNumber", sql.NVarChar, ownerPhoneNumber)
        .input("ownerEmail", sql.NVarChar, ownerEmail)
        .input("fromAddress", sql.NVarChar, fromAddress)
        .input("fromAddressLatitude", sql.Decimal(18, 10), fromAddressLatitude)
        .input("fromAddressLongitude", sql.Decimal(18, 10), fromAddressLongitude)
        .input("toAddress", sql.NVarChar, toAddress)
        .input("toAddressLatitude", sql.Decimal(18, 10), toAddressLatitude)
        .input("toAddressLongitude", sql.Decimal(18, 10), toAddressLongitude)
        .input("date", sql.NVarChar, date)
        .input("time", sql.NVarChar, time)
        .input("isAvailable", sql.Bit, isAvailable)
        .input("isActive", sql.Bit, isActive)
        .input("rideTypeID", sql.Int, rideTypeID)
        .input("chosenUserID", sql.Int, chosenUserID)
        .query(`update rides set ownerName = @ownerName, ownerPhoneNumber = @ownerPhoneNumber, 
        ownerEmail = @ownerEmail, fromAddress = @fromAddress, 
        fromAddressLatitude = @fromAddressLatitude, fromAddressLongitude = @fromAddressLongitude, 
        toAddress = @toAddress, toAddressLatitude = @toAddressLatitude, 
        toAddressLongitude = @toAddressLongitude, date = @date, time = @time, isAvailable = @isAvailable, 
        isActive = @isActive, rideTypeID = @rideTypeID, chosenUserID = @chosenUserID where rideID = @rideID`);
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

router.get('/occupyRide/:rideID/:userID/:userEmail/:rideTypeID', async (req, res) => {
    console.log(req.params.rideTypeID);
    let result = await connectionsPool.request()
        .input("rideID", sql.Int, req.params.rideID)
        .input("userID", sql.Int, req.params.userID)
        .input("isAvailable", sql.Bit, false)
        .query(`update rides set isAvailable = @isAvailable, chosenUserID = @userID where rideID = @rideID 
            AND chosenUserID is NULL`);
    if (result.rowsAffected[0] === 1) {
        let s = "ride " + req.params.rideID + " occupied by user " + req.params.userID;
        try {
            const msg = req.params.rideTypeID === REQUEST_RIDE_ID + "" ?
                `<b>הצעתך לצירוף לנסיעה אושרה.</b><br>`
                : `<b>בקשתך להצטרפות לנסיעה אושרה.</b><br>`;
            const to = req.params.userEmail;
            const message = `<div style="direction:rtl;text-align: right;">
            ${msg}
            <p>לחץ כאן לצפייה בנסיעה: <a href="http://192.168.59.1:3001/ride/${req.params.rideID}">צפייה בנסיעה</a></p></div>"`

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'mftcarpool@gmail.com', // sender address
                to: to, // list of receivers
                subject: req.params.rideTypeID === REQUEST_RIDE_ID + "" ?
                    "אישור הצעת צירוף לנסיעה" :
                    "אישור בקשת הצטרפות לנסיעה", // Subject line
                // text: "Hello world?", // plain text body
                html: message // html body
            });
        }
        catch (ex) {
            res.redirect('/fail');
        }
        res.redirect(`http://192.168.59.1:3001/rideOccupied/${req.params.rideTypeID}`);
    }
    else {
        res.redirect('/fail');
    }
});

router.post('/wantToJoinRide', async (req, res) => {
    try {
        const to = req.body.ownerEmail;
        const message = `<div style="direction:rtl;text-align: right;">
        <b>שלום ${req.body.ownerName},</b><br>
        <b>${req.body.userName} רוצה להצטרף אליך לנסיעה.</b><br>
        <b>פרטים:</b><br>
        <b>טלפון: ${req.body.userPhoneNumber}</b><br>
        <b>מייל: ${req.body.userEmail}</b><br>
        <b>נקודת איסוף: ${req.body.userPickupLocation} </b>
        <p>לצפייה במיקום על המפה: <a href="https://nominatim.openstreetmap.org/reverse.php?format=html&lat=${req.body.userPickupLocationLatitude}&lon=${req.body.userPickupLocationLongitude}&zoom=17">צפייה במפה</a></p>
        <p>לחץ כאן לאישור הבקשה: <a href="http://192.168.59.1:3000/rides/occupyRide/${req.body.rideID}/${req.body.userID}/${req.body.userEmail}/${OFFER_RIDE_ID}">אישור הבקשה</a></p></div>"`

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'mftcarpool@gmail.com', // sender address
            to: to, // list of receivers
            subject: "בקשת הצטרפות לנסיעה", // Subject line
            // text: "Hello world?", // plain text body
            html: message // html body
        });

        res.send("mail was sent!");
    }
    catch (ex) {
        res.send('error in sending email');
    }
});

router.post('/wantToAnswerRequest', async (req, res) => {
    try {
        const to = req.body.ownerEmail;
        const message = `<div style="direction:rtl;text-align: right;">
        <b>שלום ${req.body.ownerName},</b><br>
        <b>${req.body.userName} רוצה לצרף אותך אליו לנסיעה.</b><br>
        <b>פרטים:</b><br>
        <b>טלפון: ${req.body.userPhoneNumber}</b><br>
        <b>מייל: ${req.body.userEmail}</b><br>
        <b>נקודת מוצא: ${req.body.userPickupLocation} </b>
        <p>לצפייה במיקום על המפה: <a href="https://nominatim.openstreetmap.org/reverse.php?format=html&lat=${req.body.userPickupLocationLatitude}&lon=${req.body.userPickupLocationLongitude}&zoom=17">צפייה במפה</a></p>
        <p>לחץ כאן לאישור ההצעה: <a href="http://192.168.59.1:3000/rides/occupyRide/${req.body.rideID}/${req.body.userID}/${req.body.userEmail}/${REQUEST_RIDE_ID}">אישור ההצעה</a></p></div>"`

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'mftcarpool@gmail.com', // sender address
            to: to, // list of receivers
            subject: "בקשת צירוף לנסיעה", // Subject line
            // text: "Hello world?", // plain text body
            html: message // html body
        });

        res.send("mail was sent!");
    }
    catch (ex) {
        res.send('error in sending email');
    }
});

module.exports = router;
