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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function RideDialog(props) {
  const [open, setOpen] = useState(props.open);

  const [page, setPage] = useState(1);

  const [showFollowup, setShowFollowup] = useState(false);

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupLatitude, setPickupLatitude] = useState("");
  const [pickupLongitude, setPickupLongitude] = useState("");

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

  const handlJoinOfferSubmit = async (values) => {
    //here we will need the info of the current user
    let user = new User(1, "mor", "1234567891", "mftcarpool@gmail.com", true);
    //user is the one who wants to join the ride and the owner is the one offering the ride
    const response = await axios.post(
      'http://localhost:3000/rides/wantToJoinRide',
      {
        rideID: props.ride.rideID, ownerEmail: props.ride.email, ownerName: props.ride.name,
        userID: user.userID, userName: values.name, userPhoneNumber: values.phone,
        userEmail: values.email, userPickupLocation: pickupLocation, 
        userPickupLocationLatitude: pickupLatitude, userPickupLocationLongitude: pickupLongitude
      }
    );
    console.log(response);
    alert(response.status === 200 ? `נשלח מייל לבעל ההצעה המכיל את פרטיך.\nבמידה והוא יאשר, תקבל על כך מייל.` 
    :
      "קרתה תקלה בעת שליחת הבקשה, אנא נסה שנית.");
    handleClose();
  }

  const handlePickupLocationInputChange = (val) => {
    setPickupLocation(val);
  }

  const handlePickupLocationMarkerChange = (lat, lon) => {
    setPickupLatitude(lat);
    setPickupLongitude(lon);
  }

  const isLocationsValid = () => {
    if (pickupLatitude === "" || pickupLatitude === null ||
      pickupLongitude === "" || pickupLongitude === null) {
      return false;
    }
    else {
      return true;
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      name: '',
      phone: '',
      email: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'נא הכנס שם מלא')
        .max(100, 'נא צמצם את השם')
        .required('שדה זה הוא חובה'),
      phone: Yup.string()
        .min(10, 'נא הכנס מספר טלפון תקין')
        .max(10, 'נא הכנס מספר טלפון תקין')
        .required('שדה זה הוא חובה'),
      email: Yup.string()
        .email('נא הכנס מייל תקין')
        .required('שדה זה הוא חובה')
    }),
    onSubmit: values => {
      console.log(values);
      let isLocationsValidRes = isLocationsValid();
      if (isLocationsValidRes && formik.isValid) {
        //everything is valid
        handlJoinOfferSubmit(values);
      }
    }
  });

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
              <form className={styles.fillInfoForm} noValidate autoComplete="off">
                <div className={styles.fillInfoDetails}>
                  <TextField className={styles.fillInfoName} id="name" label="שם מלא" color="primary"
                    error={formik.touched.name && formik.errors.name ? true : false}
                    {...formik.getFieldProps('name')}
                    helperText={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <AccountCircleIcon className={styles.fillInfoNameIcon}></AccountCircleIcon>
                        </InputAdornment>
                      ),
                    }} />
                  <TextField className={styles.fillInfoPhone} id="phone" label="פלאפון" color="primary"
                    error={formik.touched.phone && formik.errors.phone ? true : false}
                    {...formik.getFieldProps('phone')}
                    helperText={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <PhoneIcon className={styles.fillInfoPhoneIcon}></PhoneIcon>
                        </InputAdornment>
                      ),
                    }} />
                  <TextField className={styles.fillInfoEmail} id="email" label='דוא"ל' color="primary"
                    error={formik.touched.email && formik.errors.email ? true : false}
                    {...formik.getFieldProps('email')}
                    helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <EmailIcon className={styles.fillInfoEmailIcon}></EmailIcon>
                        </InputAdornment>
                      ),
                    }} />
                  <div className={styles.fillInfoMap}>
                    <ExampleMap onInputChange={handlePickupLocationInputChange}
                      onMarkerChange={handlePickupLocationMarkerChange} label="כתובת איסוף" />
                  </div>
                </div>
              </form>
            }
            <div className={styles.fillInfoButtons}>
              {props.ride.rideTypeID === REQUEST_RIDE_ID ?
                <Button className={styles.fillInfoJoin} onClick={handleMeet} color="primary" autoFocus>
                  אישור
            </Button> :
                <Button className={styles.fillInfoJoin} onClick={formik.handleSubmit} color="primary" autoFocus>
                  אישור
            </Button>
              }
              <Button className={styles.fillInfoCancel} onClick={handleClose} color="primary">
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
                  <ExampleMap latitude={props.ride.fromAddressLatitude} 
                  longitude={props.ride.fromAddressLongitude} input={props.ride.fromAddress} />
                </div>
                <div className={styles.mapEnd}>
                  <ExampleMap latitude={props.ride.toAddressLatitude} 
                  longitude={props.ride.toAddressLongitude} input={props.ride.toAddress} />
                </div>
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
