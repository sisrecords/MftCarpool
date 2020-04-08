import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './personalDetails.module.css';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';


export default function PersonalDetails(props) {
    const [open, setOpen] = React.useState(props.open);
    const [changeDetails, setChangeDetails] = React.useState(false);
    const [pdName, setPdName] = React.useState(props.personDetails.name);
    const [pdAddress, setPdAddress] = React.useState(props.personDetails.address.street + ' ' + props.personDetails.address.num);
    const [pdCity, setPdCity] = React.useState(props.personDetails.address.city);
    const [pdPhone, setPdPhone] = React.useState(props.personDetails.phone);
    const [pdEmail, setPdEmail] = React.useState(props.personDetails.email);
    
    const [tempName, setTempName] = React.useState(pdName);
    const [tempAddress, setTempAddress] = React.useState(pdAddress);
    const [tempCity, setTempCity] = React.useState(pdCity);
    const [tempPhone, setTempPhone] = React.useState(pdPhone);
    const [tempEmail, setTempEmail] = React.useState(pdEmail);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleChangeDetails = () => {
        setPdName(tempName);
        setPdAddress(tempAddress);
        setPdCity(tempCity);
        setPdPhone(tempPhone);
        setPdEmail(tempEmail);
        setChangeDetails(changeDetails => !changeDetails);      
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
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                    פרטים אישיים </DialogTitle>
                {changeDetails ?
                    <div className={styles.details}>
                        <TextField required  className={styles.nameEdit} id="name" label="שם מלא" color="secondary" defaultValue={pdName} onChange={(event)=>setTempName(event.target.value)} />
                        <TextField required  className={styles.addressEdit} id="begLocation" label="כתובת מגורים" color="secondary" defaultValue={pdAddress} onChange={(event)=>setTempAddress(event.target.value)}/>
                        <TextField required  className={styles.cityEdit} id="endLocation" label="עיר מגורים" color="secondary" defaultValue={pdCity} onChange={(event)=>setTempCity(event.target.value)} />
                        <TextField required  className={styles.phoneEdit} id="phone" label="פלאפון" color="secondary" defaultValue={pdPhone} onChange={(event)=>setTempPhone(event.target.value)}/>
                        {/* <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div> */}
                        <TextField required  className={styles.emailEdit} id="email" label='דוא"ל' color="secondary" defaultValue={pdEmail} onChange={(event)=>setTempEmail(event.target.value)}/>
                        {/* <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div> */}
                    </div> :
                    <div className={styles.details}>
                        <div className={styles.editIconDiv}><EditIcon onClick={handleChangeDetails}></EditIcon></div>
                        <div className={styles.nameLable}>שם מלא</div>
                        <div className={styles.name}>{pdName}</div>
                        <div className={styles.addressLable}>כתובת מגורים</div>
                        <div className={styles.address}>{pdAddress}</div>
                        <div className={styles.city}>{pdCity}</div>
                        {/* <div className={styles.phoneIconDiv}><PhoneIcon className={styles.phoneIcon}></PhoneIcon></div> */}
                        <div className={styles.phoneLable}>פלאפון</div>
                        <div className={styles.phone}>{pdPhone}</div>
                        {/* <div className={styles.emailIconDiv}><EmailIcon className={styles.emailIcon} /></div> */}
                        <div className={styles.emailLable}>דוא"ל</div>
                        <div className={styles.email}>{pdEmail}</div>
                    </div>

                }

                <div className={styles.buttons}>
                    {changeDetails ?
                        <Button className={styles.join} onClick={handleChangeDetails} color="primary" autoFocus>
                            שמור שינויים</Button> :
                        <Button className={styles.join} onClick={handleClose} color="primary" autoFocus>
                            סגור</Button> 
                    }
                    {changeDetails ?
                        <Button className={styles.cancel} onClick={() => setChangeDetails(false)} color="primary">
                            ביטול </Button> : 
                        <Button className={styles.cancel} style={{visibility: "hidden"}} color="primary">
                         טקסט</Button>
                    }
                </div>

            </Dialog>
        </div>
    );
}
