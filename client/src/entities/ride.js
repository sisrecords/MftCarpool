class Ride{
    constructor(rideID, ownerName, ownerPhoneNumber, ownerEmail, fromAddress, fromAddressLatitude, 
        fromAddressLongitude, toAddress, toAddressLatitude, toAddressLongitude, date, time, isAvailable, 
        isActive, rideTypeID, chosenUserID){
        this.rideID = rideID;
        this.ownerName = ownerName;
        this.ownerPhoneNumber = ownerPhoneNumber;
        this.ownerEmail = ownerEmail;
        this.fromAddress = fromAddress;
        this.fromAddressLatitude = fromAddressLatitude;
        this.fromAddressLongitude = fromAddressLongitude;
        this.toAddress = toAddress;
        this.toAddressLatitude = toAddressLatitude;
        this.toAddressLongitude = toAddressLongitude;
        this.date = date;
        this.time = time;
        this.isAvailable = isAvailable;
        this.isActive = isActive;
        this.rideTypeID = rideTypeID;
        this.chosenUserID = chosenUserID;
    }
}

export default Ride;

const OFFER_RIDE_ID = 1;
const REQUEST_RIDE_ID = 2;
export {OFFER_RIDE_ID, REQUEST_RIDE_ID}