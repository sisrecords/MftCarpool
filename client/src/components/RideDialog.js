import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './rideDialog.module.css';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Pagination from '@material-ui/lab/Pagination';
import ExampleMap from "./map";
import { REQUEST_RIDE_ID } from '../entities/ride';
import User from '../entities/user';
import axios from 'axios';

export default function RideDialog(props) {
  const [open, setOpen] = useState(props.open);

  const [page, setPage] = useState(1);

  const [showFollowup, setShowFollowup] = useState(false);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleMeet = () => {
    // לשלוח בקשה לשרת ומשם הוא יטפל בזה
    handleClose();
  }

  const handlJoinOfferStart = () => {
    setShowFollowup(true);
  }

  const handlJoinOfferSubmit = async () => {
    //here we will need the info of the current user
    let user = new User(1, "mor", "1234567891", "mftcarpool@gmail.com", true);
    //user is the one who wants to join the ride and the owner is the one offering the ride
    const response = await axios.post(
      'http://localhost:3000/rides/wantToJoinRide',
      {
        rideID: props.ride.rideID, ownerEmail: props.ride.email, ownerName: props.ride.name,
        userID: user.userID, userName: user.userName, userPhoneNumber: user.userPhoneNumber, 
        userEmail: user.userEmail
      }
    );
    console.log(response);
    alert(response.status === 200 ? "נשלח מייל לבעל ההצעה המכיל את פרטיך. במידה והוא יאשר, תקבל על כך מייל. " :
      "קרתה תקלה בעת שליחת הבקשה, אנא נסה שנית.");
    handleClose();
  }

  return (
    <div>
      <Dialog className={styles.dialog}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        {showFollowup ?
          <div className={styles.dialogContent}>
            <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
              מילוי פרטים </DialogTitle>
            {props.ride.rideTypeID === REQUEST_RIDE_ID ?
              <div className={styles.details}>request</div>
              :
              <div className={styles.details}>offer</div>
            }
            <div className={styles.buttons}>
              {props.ride.rideTypeID === REQUEST_RIDE_ID ?
                <Button className={styles.join} onClick={handleMeet} color="primary" autoFocus>
                  אישור
            </Button> :
                <Button className={styles.join} onClick={handlJoinOfferSubmit} color="primary" autoFocus>
                  אישור
            </Button>
              }
              <Button className={styles.cancel} onClick={handleClose} color="primary">
                ביטול
          </Button>
            </div>
          </div>
          :
          <div className={styles.dialogContent}>
            {
              props.ride.rideTypeID === REQUEST_RIDE_ID ?
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                  פרטי הצעה </DialogTitle> :
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                  פרטי בקשה </DialogTitle>
            }
            {page == 1 ?
              <div className={styles.details}>
                <div className={styles.personalDetailsLabel}>פרטים אישיים</div>
                <div className={styles.name}>{props.ride.name}</div>
                <div className={styles.fromTo}><img style={{ height: '80px' }} src='/images/fromto2.png' alt="from_to" /></div>
                <div className={styles.pickupLocationLabel}>נקודת מוצא</div>
                <div className={styles.fromAddress}>{props.ride.fromLocationWithoutCity}</div>
                <div className={styles.fromCity}>{props.ride.fromLocationCity}</div>
                <div className={styles.dropLocationLabel}>נקודת יעד</div>
                <div className={styles.toAddress}>{props.ride.toLocationWithoutCity}</div>
                <div className={styles.toCity}>{props.ride.toLocationCity}</div>
                <div className={styles.dateLabel}>תאריך</div>
                <div className={styles.dateIconDiv}><EventIcon className={styles.dateIcon} /></div>
                <div className={styles.date}>{props.ride.date}</div>
                <div className={styles.timeLabel}>שעה</div>
                <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div>
                <div className={styles.time}>{props.ride.time}</div>
                <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
                <div className={styles.phone}>{props.ride.phone}</div>
                <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>
                <div className={styles.email}>{props.ride.email}</div>
              </div>
              : <div className={styles.mapDetails}>
                <div className={styles.mapBeg}>
                  {/* here we will take this info from the props.ride and pass it to the map */}
                  <ExampleMap latitude={31.9517728} longitude={34.8164472}
                    input={'בי"ס ממ"ד ישרון, ירמיהו הנביא, 13, גורדון, ראשון לציון'} />
                </div>
                <div className={styles.mapEnd}>
                  {/* here we will take this info from the props.ride and pass it to the map */}
                  <ExampleMap latitude={31.9517728} longitude={34.8164472}
                    input={'בי"ס ממ"ד ישרון, ירמיהו הנביא, 13, גורדון, ראשון לציון'} />
                </div>
                {/* onInputChange={(val)=>{}} onMarkerChange={(lat, lon)=>{}}  */}
                {/* <div className={styles.map}><img src='/images/map_example.png' alt="from_to" /></div> */}
              </div>
            }
            <div className={styles.buttons}>
              <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} color="primary" />
              {props.ride.rideTypeID === REQUEST_RIDE_ID ?
                <Button className={styles.join} onClick={handleMeet} color="primary" autoFocus>
                  צרף אליי לנסיעה!
            </Button> :
                <Button className={styles.join} onClick={handlJoinOfferStart} color="primary" autoFocus>
                  אני רוצה להצטרף!
            </Button>
              }
              <Button className={styles.cancel} onClick={handleClose} color="primary">
                ביטול
          </Button>
            </div>
          </div>
        }
      </Dialog>
    </div>
  );
}
