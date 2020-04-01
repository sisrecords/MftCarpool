import React from 'react';
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

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function AddRequest(props) {
    const [open, setOpen] = React.useState(props.open);

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const [page, setPage] = React.useState(1);

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
                    {page == 1 ? 
                <form className={styles.form} noValidate autoComplete="off">
                    <div className={styles.details}>
                        <TextField className={styles.name} id="name" label="שם מלא" color="secondary" />
                        <div className={styles.fromTo}><img style={{ height: '70px' }} src='/images/fromto2.png' alt="from_to" /></div>
                        <TextField className={styles.fromAddress} id="begLocation" label="נקודת מוצא" color="secondary" />
                        <TextField className={styles.toAddress} id="endLocation" label="נקודת יעד" color="secondary" />
                        {/* <TextField className={styles.date} id="date" label="תאריך" color="secondary" /> */}

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
                        <TextField className={styles.phone} id="phone" label="פלאפון" color="secondary" />
                        <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
                        <TextField className={styles.email} id="email" label='דוא"ל' color="secondary" />
                        <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>

                        
                    </div>
                </form>
                : <div className={styles.details}>
                    <div className={styles.mapBeg}><img src='/images/map_example.png' alt="from_to" /></div>
                    <div className={styles.mapEnd}><img src='/images/map_example.png' alt="from_to" /></div>
                </div>}
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
