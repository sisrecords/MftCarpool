import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './addOffer.module.css';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import ExampleMap from "./map";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Ride, { OFFER_RIDE_ID } from '../entities/ride';
import axios from 'axios';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function AddOffer(props) {
    const [open, setOpen] = useState(props.open);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [page, setPage] = useState(1);

    const [fromLocation, setFromLocation] = useState("");
    const [fromLatitude, setFromLatitude] = useState("");
    const [fromLongitude, setFromLongitude] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [toLatitude, setToLatitude] = useState("");
    const [toLongitude, setToLongitude] = useState("");

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (ride) => {
        setOpen(false);
        props.onClose(ride);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSendRequest = async (values) => {
        const response = await axios.post(
            'http://localhost:3000/rides/addRide',
            {
                ownerName: values.name, ownerPhoneNumber: values.phone, ownerEmail: values.email,
                fromAddress: fromLocation, fromAddressLatitude: fromLatitude,
                fromAddressLongitude: fromLongitude, toAddress: toLocation,
                toAddressLatitude: toLatitude, toAddressLongitude: toLongitude,
                date: selectedDate.toLocaleDateString(), time: values.time, isAvailable: true,
                isActive: true, rideTypeID: OFFER_RIDE_ID, chosenUserID: null
            }
        );
        let rideID = response.data.recordset[0][""];
        console.log(rideID);
        //let userID = 1; //need to get the current user ID - we will get it from the server in the app init
        let newRide = new Ride(rideID, values.name, values.phone, values.email, fromLocation, fromLatitude,
            fromLongitude, toLocation, toLatitude, toLongitude, selectedDate.toLocaleDateString(),
            values.time, true, true, OFFER_RIDE_ID, null);
        //we will pass the new ride to the handleClose which will pass it to the props.onClose func, so 
        //we can get it in the main screen and add it to the list
        handleClose(newRide);
    }

    const handleFromLocationInputChange = (val) => {
        setFromLocation(val);
    }

    const handleFromLocationMarkerChange = (lat, lon) => {
        setFromLatitude(lat);
        setFromLongitude(lon);
    }

    const handleToLocationInputChange = (val) => {
        setToLocation(val);
    }

    const handleToLocationMarkerChange = (lat, lon) => {
        setToLatitude(lat);
        setToLongitude(lon);
    }

    const isLocationsValid = () => {
        if (fromLatitude === "" || fromLatitude === null ||
            fromLongitude === "" || fromLongitude === null ||
            toLatitude === "" || toLatitude === null ||
            toLongitude === "" || toLongitude === null) {
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
            email: '',
            time: ''
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
                .required('שדה זה הוא חובה'),
            time: Yup.string()
                // .min(2, 'נא הכנס שעה וזמן ביום: למשל, 9 בבוקר')
                // .max(100, 'נא צמצם את המלל')
                .required('שדה זה הוא חובה')
        }),
        onSubmit: values => {
            console.log(values);
            let isLocationsValidRes = isLocationsValid();
            if (isLocationsValidRes && formik.isValid) {
                //everything is valid
                handleSendRequest(values);
            }
        }
    });

    return (
        <div>
            <Dialog className={styles.dialog}
                disableBackdropClick
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className={styles.title} id="alert-dialog-title">
                    מילוי פרטי הצעה </DialogTitle>
                <form className={styles.form} noValidate autoComplete="off"
                    style={{
                        visibility: page === 1 ? 'visible' : 'hidden',
                        position: page === 1 ? 'relative' : 'absolute'
                    }}>
                    <div className={styles.details}>
                        <TextField className={styles.name} id="name" label="שם מלא" color="primary"
                            error={formik.touched.name && formik.errors.name ? true : false}
                            {...formik.getFieldProps('name')}
                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : null} />
                        <TextField className={styles.phone} id="phone" label="פלאפון" color="primary"
                            error={formik.touched.phone && formik.errors.phone ? true : false}
                            {...formik.getFieldProps('phone')}
                            helperText={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null} />
                        <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
                        <TextField className={styles.email} id="email" label='דוא"ל' color="primary"
                            error={formik.touched.email && formik.errors.email ? true : false}
                            {...formik.getFieldProps('email')}
                            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null} />
                        <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>
                        {/* <div className={styles.fromTo}><img style={{ height: '70px' }} src='/images/fromto2.png' alt="from_to" /></div>
                        <TextField className={styles.fromAddress} id="begLocation" label="נקודת מוצא" color="secondary" />
                        <TextField className={styles.toAddress} id="endLocation" label="נקודת יעד" color="secondary" /> */}

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid className={styles.date} container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    disablePast
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="תאריך"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>

                        <div className={styles.dateIconDiv}><EventIcon className={styles.dateIcon} /></div>
                        {/* <TextField className={styles.time} id="time" label="שעה" color="primary"
                            {...formik.getFieldProps('time')}
                            error={formik.touched.time && formik.errors.time ? true : false}
                            helperText={formik.touched.time && formik.errors.time ? formik.errors.time : null} />
                        <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div> */}

                        <TextField
                            id="time"
                            label="שעה"
                            color="primary"
                            type="time"
                            {...formik.getFieldProps('time')}
                            className={styles.time}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                step: 60 // 1 min
                            }}
                            error={formik.touched.time && formik.errors.time ? true : false}
                            helperText={formik.touched.time && formik.errors.time ? formik.errors.time : null} />
                        <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div>


                    </div>
                </form>
                <div className={styles.details} style={{
                    visibility: page === 2 ? 'visible' : 'hidden',
                    position: page === 2 ? 'relative' : 'absolute'
                }}>
                    <div className={styles.mapBeg}>
                        <ExampleMap onInputChange={handleFromLocationInputChange}
                            onMarkerChange={handleFromLocationMarkerChange} label="כתובת מוצא" />
                    </div>
                    <div className={styles.mapEnd}>
                        <ExampleMap onInputChange={handleToLocationInputChange}
                            onMarkerChange={handleToLocationMarkerChange} label="כתובת יעד" />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} color="primary" />
                    <Button className={styles.ok}
                        onClick={isLocationsValid() && formik.isValid ? formik.handleSubmit :
                            isLocationsValid() && page === 2 ? (values) => { setPage(1); formik.handleSubmit(values) } :
                                formik.isValid && page === 1 ? () => setPage(2) : formik.handleSubmit}
                        color="primary">
                        שליחת הצעה  </Button>
                    <Button className={styles.cancel} onClick={handleCancel} color="primary">
                        ביטול   </Button>
                </div>

            </Dialog>
        </div>
    );
}
