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
import User, { currentUser, setCurrentUser } from "../entities/user";
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';

export default function PersonalDetails(props) {
    const [open, setOpen] = React.useState(props.open);
    const [changeDetails, setChangeDetails] = React.useState(false);
    const [pdName, setPdName] = React.useState(currentUser.userName);
    const [pdPhone, setPdPhone] = React.useState(currentUser.userPhoneNumber);
    const [pdEmail, setPdEmail] = React.useState(currentUser.userEmail);
    const [pdPassword, setPdPassword] = React.useState(currentUser.userPassword);

    const [tempName, setTempName] = React.useState(pdName);
    const [tempPhone, setTempPhone] = React.useState(pdPhone);
    const [tempEmail, setTempEmail] = React.useState(pdEmail);
    const [tempPassword, setTempPassword] = React.useState(pdPassword);

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(showPassword => !showPassword);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleChangeDetails = (values) => {
        console.log(values);
        if (currentUser.userName === values.name && currentUser.userPassword === values.password &&
            currentUser.userPhoneNumber === values.phone && currentUser.userEmail === values.email) {
            console.log("no change");
            setChangeDetails(changeDetails => !changeDetails);
            return;
        }
        trackPromise(axios.post(
            'http://localhost:3000/users/updateUser',
            {
                userID: currentUser.userID, userName: values.name, userPassword: values.password, userPhoneNumber: values.phone,
                userEmail: values.email, isActive: true
            }
        ).then(result => {
            console.log(result);
            // let user = result.data[0];
            if (result.data === "user updated") {
                let clientUser = new User(currentUser.UserID, values.name, values.password,
                    values.phone, values.email, true);
                setCurrentUser(clientUser);
                setPdName(values.name);
                setPdPhone(values.phone);
                setPdEmail(values.email);
                setPdPassword(values.password);
                setChangeDetails(changeDetails => !changeDetails);
            }
            else {
                alert("חלה שגיאה בעת ביצוע הפעולה.");
            }
        }));
    };

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        initialValues: {
            name: pdName,
            phone: pdPhone,
            email: pdEmail,
            password: pdPassword
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
            password: Yup.string()
                .min(8, 'נא הכנס 8 תווים לפחות')
                .max(50, 'אין להכניס יותר מ50 תווים')
                .required('שדה זה הוא חובה')
        }),
        onSubmit: values => {
            console.log(values);
            if (formik.isValid) {
                console.log("form is valid");
                handleChangeDetails(values);
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
                <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                    פרטים אישיים </DialogTitle>
                {changeDetails ?
                    <form className={styles.form} noValidate autoComplete="off">
                        <div className={styles.details}>
                            <TextField className={styles.nameEdit} id="name" label="שם מלא" color="primary"
                                error={formik.touched.name && formik.errors.name ? true : false}
                                {...formik.getFieldProps('name')}
                                helperText={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <AccountCircleIcon className={styles.nameIcon}></AccountCircleIcon>
                                        </InputAdornment>
                                    ),
                                }} />
                            <TextField className={styles.phoneEdit} id="phone" label="פלאפון" color="primary"
                                error={formik.touched.phone && formik.errors.phone ? true : false}
                                {...formik.getFieldProps('phone')}
                                helperText={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <PhoneIcon className={styles.phoneIcon}></PhoneIcon>
                                        </InputAdornment>
                                    ),
                                }} />
                            <TextField className={styles.emailEdit} id="email" label='דוא"ל' color="primary"
                                error={formik.touched.email && formik.errors.email ? true : false}
                                {...formik.getFieldProps('email')}
                                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <EmailIcon className={styles.emailIcon}></EmailIcon>
                                        </InputAdornment>
                                    ),
                                }} />
                            <TextField className={styles.passwordEdit} id="password" label='סיסמא' color="primary"
                                type={showPassword ? 'text' : 'password'}
                                error={formik.touched.password && formik.errors.password ? true : false}
                                {...formik.getFieldProps('password')}
                                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <LockIcon className={styles.passwordIcon}></LockIcon>
                                        </InputAdornment>
                                    ),
                                }} />
                        </div>
                    </form>
                    // <div className={styles.details}>
                    //     <TextField required  className={styles.nameEdit} id="name" label="שם מלא" color="secondary" defaultValue={pdName} onChange={(event)=>setTempName(event.target.value)} />
                    //     <TextField required  className={styles.phoneEdit} id="phone" label="פלאפון" color="secondary" defaultValue={pdPhone} onChange={(event)=>setTempPhone(event.target.value)}/>
                    //     <TextField required  className={styles.emailEdit} id="email" label='דוא"ל' color="secondary" defaultValue={pdEmail} onChange={(event)=>setTempEmail(event.target.value)}/>
                    //     <TextField required  className={styles.passwordEdit} id="password" label='סיסמא' color="secondary" defaultValue={pdPassword} onChange={(event)=>setTempPassword(event.target.value)}/>
                    // </div>
                    :
                    <div className={styles.details}>
                        <div className={styles.editIconDiv}><EditIcon onClick={() => setChangeDetails(true)}></EditIcon></div>
                        <div className={styles.nameLabel}>שם מלא</div>
                        <div className={styles.name}>{pdName}</div>
                        <div className={styles.phoneLabel}>פלאפון</div>
                        <div className={styles.phone}>{pdPhone}</div>
                        <div className={styles.emailLabel}>דוא"ל</div>
                        <div className={styles.email}>{pdEmail}</div>
                        <div className={styles.passwordLabel}>סיסמא</div>
                        <div className={styles.password}>{pdPassword}</div>
                    </div>

                }

                <div className={styles.buttons}>
                    {changeDetails ?
                        <Button className={styles.join} onClick={formik.handleSubmit} color="primary">
                            שמור שינויים</Button> :
                        <Button className={styles.closePersonalDetails} onClick={handleClose} color="primary">
                            סגור</Button>
                    }
                    {changeDetails ?
                        <Button className={styles.cancel} onClick={() => { formik.handleReset(); setChangeDetails(false) }} color="primary">
                            ביטול </Button> :
                        <Button className={styles.cancel} style={{ visibility: "hidden" }} color="primary">
                            טקסט</Button>
                    }
                </div>

            </Dialog>
        </div>
    );
}
