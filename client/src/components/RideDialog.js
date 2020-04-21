import React, { useState, useEffect } from 'react';
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
import Ride, { REQUEST_RIDE_ID } from '../entities/ride';
import User from '../entities/user';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useParams, useHistory } from "react-router-dom";
import { transformRideFunc } from "./Main";

export default function RideDialog(props) {
  let { rideID } = useParams();
  const history = useHistory();
  let rideFromDb = null;
  const [rideToShow, setRideToShow] = useState(rideID ? rideFromDb : props.ride);
  const [hasError, setHasError] = useState(false);

  const [open, setOpen] = useState(rideID ? true : props.open);

  const [page, setPage] = useState(1);

  const [showFollowup, setShowFollowup] = useState(false);

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupLatitude, setPickupLatitude] = useState("");
  const [pickupLongitude, setPickupLongitude] = useState("");

  useEffect(() => {
    if (rideID && !rideToShow) {
      (async function getAllRides() {
        const response =
          await axios.get(`http://localhost:3000/rides/getRide/${rideID}`);
        console.log(response);
        let res = response.data;
        if (res !== "") {
          let clientRide = new Ride(res.RideID, res.OwnerName, res.OwnerPhoneNumber, res.OwnerEmail,
            res.FromAddress, res.FromAddressLatitude, res.FromAddressLongitude, res.ToAddress,
            res.ToAddressLatitude, res.ToAddressLongitude, res.Date, res.Time, res.IsAvailable,
            res.IsActive, res.RideTypeID, res.ChosenUserID);
          let ride = { ...transformRideFunc(clientRide) };
          setRideToShow(ride);
        }
        else {
          setHasError(true);
        }
      }
      )();
    }
  }, [rideID])

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (rideID) {
      history.push("/app");
    }
    else {
      props.onClose();
    }
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
    let user = new User(1, "mor", "pass", "1234567891", "mftcarpool@gmail.com", true);
    //user is the one who wants to join the ride and the owner is the one offering the ride
    const response = await axios.post(
      'http://localhost:3000/rides/wantToJoinRide',
      {
        rideID: rideToShow.rideID, ownerEmail: rideToShow.email, ownerName: rideToShow.name,
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

  const handlAnswerRequestSubmit = async (values) => {
    //here we will need the info of the current user
    let user = new User(1, "mor", "pass", "1234567891", "mftcarpool@gmail.com", true);
    //user is the one who wants to join the ride and the owner is the one offering the ride
    const response = await axios.post(
      'http://localhost:3000/rides/wantToAnswerRequest',
      {
        rideID: rideToShow.rideID, ownerEmail: rideToShow.email, ownerName: rideToShow.name,
        userID: user.userID, userName: values.name, userPhoneNumber: values.phone,
        userEmail: values.email, userPickupLocation: pickupLocation,
        userPickupLocationLatitude: pickupLatitude, userPickupLocationLongitude: pickupLongitude
      }
    );
    console.log(response);
    alert(response.status === 200 ? `נשלח מייל לבעל הבקשה המכיל את פרטיך.\nבמידה והוא יאשר, תקבל על כך מייל.`
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
        if (rideToShow.rideTypeID === REQUEST_RIDE_ID) {
          handlAnswerRequestSubmit(values);
        }
        else {
          handlJoinOfferSubmit(values);
        }
      }
    }
  });

  if (hasError) {
    return (
      <div style={{ paddingTop: "5px" }}>
        הדף המבוקש אינו נמצא
      </div>
    )
  }

  if (!rideToShow) {
    return null;
  }

  return (
    <div>
      <Dialog className={styles.dialog}
        disableBackdropClick
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        {showFollowup ?
          <div className={styles.dialogContent}>
            <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
              מילוי פרטים </DialogTitle>
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
                    onMarkerChange={handlePickupLocationMarkerChange}
                    label={rideToShow.rideTypeID === REQUEST_RIDE_ID ? "כתובת מוצא"
                      : "כתובת איסוף"} />
                </div>
              </div>
            </form>
            <div className={styles.fillInfoButtons}>
              <Button className={styles.fillInfoJoin} onClick={formik.handleSubmit} color="primary">
                אישור
              </Button>

              <Button className={styles.fillInfoCancel} onClick={handleClose} color="primary">
                ביטול
              </Button>
            </div>
          </div>
          :
          <div className={styles.dialogContent}>
            {
              rideToShow.rideTypeID === REQUEST_RIDE_ID ?
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                  פרטי הצעה </DialogTitle> :
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                  פרטי בקשה </DialogTitle>
            }
            {page == 1 ?
              <div className={styles.details}>
                <div className={styles.personalDetailsLabel}>פרטים אישיים</div>
                <div className={styles.name}>{rideToShow.name}</div>
                <div className={styles.fromTo}><img style={{ height: '80px' }} src='/images/fromto2.png' alt="from_to" /></div>
                <div className={styles.pickupLocationLabel}>נקודת מוצא</div>
                <div className={styles.fromAddress} title={rideToShow.fromLocationWithoutCity}>{rideToShow.fromLocationWithoutCity.length > 27 ?
                  rideToShow.fromLocationWithoutCity.substring(0, 24) + "..." : rideToShow.fromLocationWithoutCity}</div>

                <div className={styles.fromCity}>{rideToShow.fromLocationCity}</div>
                <div className={styles.dropLocationLabel}>נקודת יעד</div>
                <div className={styles.toAddress} title={rideToShow.toLocationWithoutCity}>{rideToShow.toLocationWithoutCity.length > 27 ?
                  rideToShow.toLocationWithoutCity.substring(0, 24) + "..." : rideToShow.toLocationWithoutCity}</div>
                <div className={styles.toCity}>{rideToShow.toLocationCity}</div>
                <div className={styles.dateLabel}>תאריך</div>
                <div className={styles.dateIconDiv}><EventIcon className={styles.dateIcon} /></div>
                <div className={styles.date}>{rideToShow.date}</div>
                <div className={styles.timeLabel}>שעה</div>
                <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div>
                <div className={styles.time}>{rideToShow.time}</div>
                <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
                <div className={styles.phone}>{rideToShow.phone}</div>
                <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>
                <div className={styles.email}>{rideToShow.email}</div>
              </div>
              : <div className={styles.mapDetails}>
                <div className={styles.mapBeg}>
                  <ExampleMap latitude={rideToShow.fromAddressLatitude}
                    longitude={rideToShow.fromAddressLongitude} input={rideToShow.fromAddress} />
                </div>
                <div className={styles.mapEnd}>
                  <ExampleMap latitude={rideToShow.toAddressLatitude}
                    longitude={rideToShow.toAddressLongitude} input={rideToShow.toAddress} />
                </div>
              </div>
            }
            {rideID ?
              <div className={styles.buttons}>
                <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} color="primary" />
                <Button className={styles.returnToMainScreen} onClick={handleClose} color="primary">
                  חזור למסך הראשי
                </Button>
              </div>
              :
              <div className={styles.buttons}>
                <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} color="primary" />
                {rideToShow.rideTypeID === REQUEST_RIDE_ID ?
                  <Button className={styles.join} onClick={handlJoinOfferStart} color="primary">
                    צרף אליי לנסיעה!
                  </Button> :
                  <Button className={styles.join} onClick={handlJoinOfferStart} color="primary">
                    אני רוצה להצטרף!
                  </Button>
                }
                <Button className={styles.cancel} onClick={handleClose} color="primary">
                  ביטול
                </Button>
              </div>
            }
          </div>
        }
      </Dialog>
    </div>
  );
}
