import React from 'react';
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

export default function RideDialog(props) {
  const [open, setOpen] = React.useState(props.open);

  const [page, setPage] = React.useState(1);

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

  return (
    <div>
      <Dialog className={styles.dialog}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {props.ride.request === '1' ?
          <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
            פרטי הצעה </DialogTitle> :
          <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
            פרטי בקשה </DialogTitle>
        }
        {page == 1 ?
          <div className={styles.details}>
            <div className={styles.personalDetailsLable}>פרטים אישיים</div>
            <div className={styles.name}>{props.ride.name}</div>
            <div className={styles.fromTo}><img style={{ height: '80px' }} src='/images/fromto2.png' alt="from_to" /></div>
            <div className={styles.pickupLocationLable}>נקודת מוצא</div>
            <div className={styles.fromAddress}>{props.ride.address.street + ' ' + props.ride.address.num}</div>
            <div className={styles.fromCity}>{props.ride.address.city}</div>
            <div className={styles.dropLocationLable}>נקודת יעד</div>
            <div className={styles.toAddress}>{props.ride.to.street + ' ' + props.ride.to.num}</div>
            <div className={styles.toCity}>{props.ride.to.city}</div>
            <div className={styles.dateLable}>תאריך</div>
            <div className={styles.dateIconDiv}><EventIcon className={styles.dateIcon} /></div>
            <div className={styles.date}>{props.ride.date}</div>
            <div className={styles.timeLable}>שעה</div>
            <div className={styles.timeIconDiv}><ScheduleIcon className={styles.timeIcon} /></div>
            <div className={styles.time}>{props.ride.time}</div>
            <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div>
            <div className={styles.phone}>{props.ride.phone}</div>
            <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div>
            <div className={styles.email}>{props.ride.email}</div>
          </div>
          : <div className={styles.details}>
            <div className={styles.map}><img src='/images/map_example.png' alt="from_to" /></div>
          </div>}
          
          <div className={styles.buttons}>
            <Pagination className={styles.pagination} count={2} page={page} onChange={handleChange} />
            {props.ride.request === '1' ?
            <Button className={styles.join} onClick={handleMeet} color="primary" autoFocus>
              צרף אליי לנסיעה!
          </Button> :
          <Button className={styles.join} onClick={handleMeet} color="primary" autoFocus>
          אני רוצה להצטרף!
      </Button>
}
            <Button className={styles.cancel} onClick={handleClose} color="primary">
              ביטול
          </Button>
          </div>

      </Dialog>
    </div>
  );
}
