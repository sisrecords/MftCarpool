import React, { useState, useEffect } from 'react';
import styles from './stylesheet.module.css';
import { IconButton, List } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import RideCard from './Ride';
import RideDialog from './RideDialog';
import AddPopper from './AddPopper';
import ScrollUpButton from "react-scroll-up-button";
import PersonalDetails from './PersonalDetails';
import Ride, { OFFER_RIDE_ID, REQUEST_RIDE_ID } from '../entities/ride';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

var ridesDBList = [];

function transformRide(ride) {
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
    toLocationCity: toLocationCity, date: ride.date, name: ride.ownerName,
    phone: ride.ownerPhoneNumber, email: ride.ownerEmail
  };
  return newRide;
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
  var lat1Rad = toRad(lat1);
  var lat2Rad = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

function Main() {

  function sortList(list) {
    return list.sort((a, b) => {
      return Number(a.distance) - Number(b.distance)
    });
  }
  const [ridesList, setRidesList] = useState(sortList(ridesDBList));
  const [selectedRide, setSelectedRide] = useState(null);
  const [allSelect, setAllSelect] = useState(true);
  const [requestSelect, setRequestSelect] = useState(false);
  const [offerSelect, setOfferSelect] = useState(false);
  const [historySelect, setHistorySelect] = useState(false);
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(null);

  useEffect(() => {
    (async function getAllRides() {
      let response;
      trackPromise(
        response = axios.get("http://localhost:3000/rides/getAllRides").then(
          result => {
            console.log(result);
            let rides = result.data;
            let updatedRides = [];
            rides.map(ride => {
              let clientRide = new Ride(ride.RideID, ride.OwnerName, ride.OwnerPhoneNumber, ride.OwnerEmail,
                ride.FromAddress, ride.FromAddressLatitude, ride.FromAddressLongitude, ride.ToAddress,
                ride.ToAddressLatitude, ride.ToAddressLongitude, ride.Date, ride.Time, ride.IsAvailable,
                ride.IsActive, ride.RideTypeID, ride.ChosenUserID);
              updatedRides.push(transformRide(clientRide));
            });
            ridesDBList = [...updatedRides];
            setRidesList(sortList(updatedRides));
          }
        ));
    })();
  }, [])

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
    let newRide = transformRide(ride);
    let copyList = [...ridesDBList];
    copyList.push(newRide);
    ridesDBList = sortList(copyList);
    onAllClick();
  }

  function onAllClick() {
    setRidesList(ridesDBList.filter(ride => ride.isAvailable === true));
    setAllSelect(true);
    setRequestSelect(false);
    setOfferSelect(false);
    setHistorySelect(false);
  }

  function onRequestClick() {
    setRidesList(ridesDBList.filter(ride => ride.rideTypeID === REQUEST_RIDE_ID));
    setAllSelect(false);
    setRequestSelect(true);
    setOfferSelect(false);
  }

  function onOfferClick() {
    setRidesList(ridesDBList.filter(ride => ride.rideTypeID === OFFER_RIDE_ID));
    setAllSelect(false);
    setRequestSelect(false);
    setOfferSelect(true);
  }

  function onHistoryClick() {
    setRidesList(ridesDBList.filter(ride => ride.isAvailable === false));
    setAllSelect(false);
    setRequestSelect(false);
    setOfferSelect(false);
    setHistorySelect(true);
  }


  return (

    <div className={styles.page}>

      <div className={styles.upper}>
        <div className={styles.carimgdiv}>
          <img className={styles.carimg} src='/images/carpool_car.png' alt="car" />
        </div>
        <div className={styles.extraDivForComputers}></div>
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
        {
          historySelect ? <div className={styles.historySelected} variant="contained" onClick={onHistoryClick}>היסטוריה</div>
          : <div className={styles.history} variant="contained" onClick={onHistoryClick}>היסטוריה</div>
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
                return <div key={ride.rideID} className={styles.ride} onClick={() => onRideClick(ride)}>
                  <RideCard className={styles.ride} itemRide={ride}>
                  </RideCard>

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
export const transformRideFunc = transformRide;