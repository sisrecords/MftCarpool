import React, { useState } from 'react';
import styles from './stylesheet.module.css';
import { IconButton, List, Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Ride from './Ride';
import RideDialog from './RideDialog';
import AddPopper from './AddPopper';
import ScrollUpButton from "react-scroll-up-button";
import PersonalDetails from './PersonalDetails';
import {OFFER_RIDE_ID, REQUEST_RIDE_ID} from '../entities/ride';

var list = [{
  name: 'שירה מזל כהן', phone: '053-5314563', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', rideTypeID: 2, distance: '2'
},
{
  name: 'נועה', phone: '052-6231196', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', rideTypeID: 1, distance: '87'
},
{
  name: 'אביתר', phone: '052-8901236', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', rideTypeID: 2, distance: '100'
}
  ,
{
  name: 'שירה', phone: '053-5314564', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', rideTypeID: 2, distance: '2'
},
{
  name: 'נועה', phone: '052-6231197', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', rideTypeID: 1, distance: '87'
},
{
  name: 'אביתר', phone: '052-8901237', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', rideTypeID: 2, distance: '100'
},
{
  name: 'שירה', phone: '053-5314565', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', rideTypeID: 2, distance: '2'
},
{
  name: 'נועה', phone: '052-6231198', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', rideTypeID: 1, distance: '87'
},
{
  name: 'אביתר', phone: '052-8901238', fromLocationWithoutCity: "ביאליק", fromLocationCity: "נתניה", toLocationWithoutCity: "גורדון", toLocationCity: "הרצליה",
  date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', rideTypeID: 2, distance: '100'
}

];

//#1976d2
function Main() {

  function sortList(list) {
    return list.sort((a, b) => {
      return Number(a.distance) - Number(b.distance)
    });
  }

  const [ridesList, setRidesList] = useState(sortList(list));
  const [selectedRide, setSelectedRide] = useState(null);
  const [allSelect, setAllSelect] = useState(true);
  const [requestSelect, setRequestSelect] = useState(false);
  const [offerSelect, setOfferSelect] = useState(false);
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(null);

  function onPersonalDetailsClick() {
    setPersonalDetailsOpen(true);
  }

  function closePersonalDetails() {
    setPersonalDetailsOpen(null);
  }

  function onRideClick(ride) {
    console.log(ride);
    setSelectedRide(ride);
    // return <RideDialog ride={ride} open={true}/>
  }

  function closeRideDialog() {
    setSelectedRide(null);
  }

  function onPopperClose(ride) {
    console.log(ride);
    let distance = Math.round(calculateDistance(+ride.fromAddressLatitude, +ride.fromAddressLongitude));
    let fromLocation = ride.fromAddress;
    let fromLocLastCommaIndex = fromLocation.lastIndexOf(", ");
    let fromLocationWithoutCity = fromLocation.substring(0, fromLocLastCommaIndex);
    let fromLocationCity = fromLocation.substring(fromLocLastCommaIndex + 2);
    let toLocation = ride.toAddress;
    let toLocLastCommaIndex = toLocation.lastIndexOf(", ");
    let toLocationWithoutCity = toLocation.substring(0, toLocLastCommaIndex);
    let toLocationCity = toLocation.substring(toLocLastCommaIndex + 2);
    let newRide = {
      ...ride, distance: distance, fromLocationWithoutCity: fromLocationWithoutCity,
      fromLocationCity: fromLocationCity, toLocationWithoutCity: toLocationWithoutCity,
      toLocationCity: toLocationCity, date: ride.date.toLocaleDateString(), name: ride.ownerName,
      phone: ride.ownerPhoneNumber, email: ride.ownerEmail
    };
    console.log(newRide);
    //here we will add it to the list
    console.log(list);
    let copyList = [ ...list ];
    copyList.push(newRide);
    list = copyList;
    onAllClick();
  }

  function calculateDistance(lat, lon) {
    //we will need to get the user's location info by asking for permission
    let userLat = 32.3;
    let userLong = 34.3;
    return calcCrow(lat, lon, userLat, userLong);
  }

  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // earth radius in km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return Value * Math.PI / 180;
  }

  function onAllClick() {
    setRidesList(list);
    setAllSelect(true);
    setRequestSelect(false);
    setOfferSelect(false);
  }

  function onRequestClick() {
    setRidesList(list.filter(ride => ride.rideTypeID === REQUEST_RIDE_ID));
    setAllSelect(false);
    setRequestSelect(true);
    setOfferSelect(false);
  }

  function onOfferClick() {
    setRidesList(list.filter(ride => ride.rideTypeID === OFFER_RIDE_ID));
    setAllSelect(false);
    setRequestSelect(false);
    setOfferSelect(true);
  }


  return (
    // <div>

    <div className={styles.page}>

      <div className={styles.upper}>
        <div className={styles.carimgdiv}>
          <img className={styles.carimg} src='/images/carpool_car.png' alt="car" />
        </div>
      </div>
      {
        personalDetailsOpen ? <PersonalDetails personDetails={ridesList[0]} open={true} onClose={closePersonalDetails} /> : null
      }
      <IconButton className={styles.accountIcon} onClick={onPersonalDetailsClick}>
        <AccountCircleIcon className={styles.accountIcon} />
      </IconButton>

      <div className={styles.buttons}>
        <div className={styles.tempBottonsThirePart}></div>
        {allSelect ? <div className={styles.allSelected} variant="contained" onClick={onAllClick}>הכל</div>
          : <div className={styles.all} variant="contained" onClick={onAllClick}>הכל</div>
        }
        {requestSelect ? <div className={styles.requestSelected} variant="contained" onClick={onRequestClick}>בקשות</div>
          : <div className={styles.request} variant="contained" onClick={onRequestClick}>בקשות</div>
        }
        {
          offerSelect ? <div className={styles.offerSelected} variant="contained" onClick={onOfferClick}>הצעות</div>
            : <div className={styles.offer} variant="contained" onClick={onOfferClick}>הצעות</div>
        }



      </div>

      <div className={styles.bottom}>
        <div className={styles.cardsList}>
          {
            selectedRide ?
              <RideDialog ride={selectedRide} open={true} onClose={closeRideDialog} /> : null
          }
          <List className={styles.list}>
            {
              ridesList.map(ride => {
                return <div key={ride.phone} className={styles.ride} onClick={() => onRideClick(ride)}>
                  <Ride className={styles.ride} itemRide={ride}>
                  </Ride>

                </div>
              })
            }
          </List>
        </div>
      </div>
      <div className={styles.addPopper}>
        <AddPopper onClose={onPopperClose} />
      </div>
      <div className={styles.scrollUp}>
        <ScrollUpButton ContainerClassName={styles.scrollUpButton} />
      </div>

    </div>

  );
}

export default Main;
