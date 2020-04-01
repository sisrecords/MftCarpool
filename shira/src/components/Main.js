import React, { useState } from 'react';
import styles from './stylesheet.module.css';
import { IconButton, List, Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Ride from './Ride';
import RideDialog from './RideDialog';
import AddPopper from './AddPopper';
import ScrollUpButton from "react-scroll-up-button";
import PersonalDetails from './PersonalDetails';

//#1976d2
function Main() {
  var list = [{
    name: 'שירה מזל כהן', phone: '053-5314563', address: { street: 'הזית', num: '12', city: 'באר שבע' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', request: '1', distance: '2'
  },
  {
    name: 'נועה', phone: '052-6231196', address: { street: 'הרצל', num: '98', city: 'נתניה' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', request: '0', distance: '87'
  },
  {
    name: 'אביתר', phone: '052-8901236', address: { street: "צ'רניחובסקי", num: '112', city: 'תל אביב' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', request: '1', distance: '100'
  }
    ,
  {
    name: 'שירה', phone: '053-5314563', address: { street: 'הזית', num: '12', city: 'באר שבע' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', request: '1', distance: '2'
  },
  {
    name: 'נועה', phone: '052-6231196', address: { street: 'הרצל', num: '98', city: 'נתניה' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', request: '0', distance: '87'
  },
  {
    name: 'אביתר', phone: '052-8901236', address: { street: "צ'רניחובסקי", num: '112', city: 'תל אביב' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', request: '1', distance: '100'
  },
  {
    name: 'שירה', phone: '053-5314563', address: { street: 'הזית', num: '12', city: 'באר שבע' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '18:00', email: 'shiraco44@gmail.com', request: '1', distance: '2'
  },
  {
    name: 'נועה', phone: '052-6231196', address: { street: 'הרצל', num: '98', city: 'נתניה' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/05/2020', time: '19:00', email: 'noa12@gmail.com', request: '0', distance: '87'
  },
  {
    name: 'אביתר', phone: '052-8901236', address: { street: "צ'רניחובסקי", num: '112', city: 'תל אביב' }, to: { street: 'הקריה', num: '', city: 'תל אביב' },
    date: '01/06/2020', time: '7:00', email: 'evya26@gmail.com', request: '1', distance: '100'
  }

  ];
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

  function onPersonalDetailsClick(){
    setPersonalDetailsOpen(true);
  }

  function closePersonalDetails(){
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

  function onAllClick() {
    setRidesList(list);
    setAllSelect(true);
    setRequestSelect(false);
    setOfferSelect(false);
  }

  function onRequestClick() {
    setRidesList(list.filter(ride => ride.request === '1'));
    setAllSelect(false);
    setRequestSelect(true);
    setOfferSelect(false);
  }

  function onOfferClick() {
    setRidesList(list.filter(ride => ride.request === '0'));
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
        personalDetailsOpen ? <PersonalDetails personDetails={ridesList[0]}  open={true} onClose={closePersonalDetails}/> : null
      }
      <IconButton className={styles.accountIcon}>
        <AccountCircleIcon className={styles.accountIcon} onClick={onPersonalDetailsClick} />
      </IconButton>

      <div className={styles.buttons}>
      <div className={styles.tempBottonsThirePart}></div>
        {allSelect ? <div className={styles.allSelected} variant="contained"  onClick={onAllClick}>הכל</div>
        :<div className={styles.all} variant="contained"  onClick={onAllClick}>הכל</div>
        }
        {requestSelect ? <div className={styles.requestSelected} variant="contained"  onClick={onRequestClick}>בקשות</div>
        :<div className={styles.request} variant="contained"  onClick={onRequestClick}>בקשות</div>
        }
        {
          offerSelect ? <div className={styles.offerSelected} variant="contained"  onClick={onOfferClick}>הצעות</div>
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
                return <div className={styles.ride} onClick={() => onRideClick(ride)}>
                  <Ride key={ride.phone} className={styles.ride} itemRide={ride}>
                  </Ride>

                </div>
              })
            }
          </List>
        </div>
      </div>
      <div className={styles.addPopper}>
        <AddPopper />
      </div>
      <div className={styles.scrollUp}>
        <ScrollUpButton ContainerClassName={styles.scrollUpButton} />
      </div>

    </div>

  );
}

export default Main;
