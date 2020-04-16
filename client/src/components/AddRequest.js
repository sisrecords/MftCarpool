import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './addRequest.module.css';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import ExampleMap from "./map";

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function AddRequest(props) {
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

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    const handleSendRequest = () => {
        // לשלוח בקשה לשרת ומשם הוא יטפל בזה
        handleClose();
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

    return (
        <div>
            <Dialog className={styles.dialog}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className={styles.title} id="alert-dialog-title">
                    מילוי פרטי בקשה </DialogTitle>
                <form className={styles.form} noValidate autoComplete="off"
                    style={{
                        visibility: page === 1 ? 'visible' : 'hidden',
                        position: page === 1 ? 'relative' : 'absolute'
                    }}>
                    <div className={styles.details}>
                        <TextField className={styles.name} id="name" label="שם מלא" color="secondary" />
                        <TextField className={styles.phone} id="phone" label="פלאפון" color="secondary" />
                        <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
                        <TextField className={styles.email} id="email" label='דוא"ל' color="secondary" />
                        <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>
                        {/* <div className={styles.fromTo}><img style={{ height: '70px' }} src='/images/fromto2.png' alt="from_to" /></div>
                        <TextField className={styles.fromAddress} id="begLocation" label="נקודת מוצא" color="secondary" />
                        <TextField className={styles.toAddress} id="endLocation" label="נקודת יעד" color="secondary" /> */}

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid className={styles.date} container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
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
                        <TextField className={styles.time} id="time" label="שעה" color="secondary" />
                        <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div>

                    </div>
                </form>
                <div className={styles.details} style={{
                    visibility: page === 2 ? 'visible' : 'hidden',
                    position: page === 2 ? 'relative' : 'absolute'
                }}>
                    <div className={styles.mapBeg}>
                        <ExampleMap onInputChange={handleFromLocationInputChange}
                            onMarkerChange={handleFromLocationMarkerChange} />
                    </div>
                    <div className={styles.mapEnd}>
                        <ExampleMap onInputChange={handleToLocationInputChange}
                            onMarkerChange={handleToLocationMarkerChange} />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} />
                    <Button className={styles.ok} onClick={handleSendRequest} color="primary" autoFocus>
                        שליחת בקשה  </Button>
                    <Button className={styles.cancel} onClick={handleClose} color="primary">
                        ביטול   </Button>
                </div>

            </Dialog>
        </div>
    );
}
