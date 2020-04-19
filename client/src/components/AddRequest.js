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
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


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
                disableBackdropClick
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
                        <TextField className={styles.name} id="name" label="שם מלא" color="secondary" 
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="end">
                                <AccountCircleIcon className={styles.fillInfoIcon}></AccountCircleIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField className={styles.phone} id="phone" label="פלאפון" color="secondary" 
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="end">
                                <PhoneIcon className={styles.fillInfoPhoneIcon}></PhoneIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField className={styles.email} id="email" label='דוא"ל' color="secondary"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="end">
                                <EmailIcon className={styles.fillInfoIcon}></EmailIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <MuiPickersUtilsProvider position="end" utils={DateFnsUtils}>
                            <Grid className={styles.date} container  justify="space-around">
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

                        <TextField className={styles.time} id="time" label="שעה" color="secondary" 
                             InputProps={{
                                startAdornment: (
                                  <InputAdornment position="end">
                                    <ScheduleIcon className={styles.fillInfoIcon}></ScheduleIcon>
                                  </InputAdornment>
                                ),
                              }} />
   
                    </div>
                </form>
                <div className={styles.details} style={{
                    visibility: page === 2 ? 'visible' : 'hidden',
                    position: page === 2 ? 'relative' : 'absolute'
                }}>
                    <div className={styles.mapBeg}>
                        <ExampleMap onInputChange={handleFromLocationInputChange}
                            onMarkerChange={handleFromLocationMarkerChange} label="כתובת מוצא"/>
                    </div>
                    <div className={styles.mapEnd}>
                        <ExampleMap onInputChange={handleToLocationInputChange}
                            onMarkerChange={handleToLocationMarkerChange} label="כתובת יעד"/>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} color="primary" />
                    <Button className={styles.ok} onClick={handleSendRequest} color="primary" autoFocus>
                        שליחת בקשה  </Button>
                    <Button className={styles.cancel} onClick={handleClose} color="primary">
                        ביטול   </Button>
                </div>

            </Dialog>
        </div>
    );
}
