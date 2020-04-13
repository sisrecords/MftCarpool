class Ride{
    constructor(rideID, ownerID, fromAddress, fromAddressLatitude, 
        fromAddressLongitude, toAddress, toAddressLatitude, toAddressLongitude, date, time, isAvailable, 
        isActive, rideTypeID, chosenUserID){
        this.rideID = rideID;
        this.ownerID = ownerID;
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