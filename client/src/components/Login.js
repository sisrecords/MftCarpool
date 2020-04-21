import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from 'axios';
import styles from './login.module.css';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import { useHistory } from "react-router-dom";
import User from "../entities/user";

export default function LoginPage(props) {
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        // history.push("/app");
    }

    const handleClickShowPassword = () => {
        setShowPassword(showPassword => !showPassword);
    };

    const handleSignup = async (values) => {
        const response = await axios.post(
            'http://localhost:3000/users/addUser',
            {
                userName: values.name, userPassword: values.password, userPhoneNumber: values.phone,
                userEmail: values.email, isActive: true
            }
        );
        let userID = response.data.recordset[0][""];
        console.log(userID);
        let user = new User(userID, values.name, values.password, values.phone, values.email, true);
        alert("ההרשמה בוצעה בהצלחה. \n לחץ אישור ותופנה לעמוד הראשי.")
        //here we will need to save the user as the current user and redirect it to the home page
        history.push("/app");

        // console.log(response);
        // alert(response.status === 200 ? `נשלח מייל לבעל ההצעה המכיל את פרטיך.\nבמידה והוא יאשר, תקבל על כך מייל.`
        //     :
        //     "קרתה תקלה בעת שליחת הבקשה, אנא נסה שנית.");
        // handleClose();
    }

    const handleLogin = async (values) => {
        const response = await axios.get(
            `http://localhost:3000/users/authUser/${values.email}/${values.password}`,
            // {
            //     params: {
            //         userEmail: values.email, userPassword: values.password
            //     }
            // }
        );
        console.log(response)
        if(response.data.length !== 0){
            console.log("success");
            history.push("/app");
        }
        else {
            console.log("invalid email/password");
            alert("שם משתמש או סיסמא שגויים, נא נסה שנית.")
        }
        // let userID = response.data.recordset[0][""];
        // console.log(userID);
        // let user = new User(userID, values.name, values.password, values.phone, values.email, true);
        // alert("ההרשמה בוצעה בהצלחה. \n לחץ אישור ותופנה לעמוד הראשי.")
        //here we will need to save the user as the current user and redirect it to the home page
        // history.push("/app");
    }

    const handleChangeToSignup = () => {
        setIsLogin(false);
        setShowPassword(true);
    }

    const handleChangeToLogin = () => {
        setIsLogin(true);
        setShowPassword(false);
    }

    const loginFormik = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
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
            if (loginFormik.isValid) {
                console.log("login form is valid");
                handleLogin(values);
            }
        }
    });

    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        initialValues: {
            name: '',
            phone: '',
            email: '',
            password: ''
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
                handleSignup(values);
            }
            // let isLocationsValidRes = isLocationsValid();
            // if (isLocationsValidRes && formik.isValid) {
            //     //everything is valid
            //     if (rideToShow.rideTypeID === REQUEST_RIDE_ID) {
            //         handlAnswerRequestSubmit(values);
            //     }
            //     else {
            //         handlJoinOfferSubmit(values);
            //     }
            // }
        }
    });

    return (
        <div style={{
            height: "100vh", width: "100vw", backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(/images/car-2158284.svg)`
        }}>
            <Dialog className={styles.dialog}
                disableBackdropClick
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {isLogin ?
                    <div className={styles.dialogContent}>
                        <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                            התחברות </DialogTitle>
                        <form className={styles.fillInfoForm} noValidate autoComplete="off">
                            <div className={styles.fillInfoDetails}>
                                <TextField className={styles.fillInfoEmail} id="email" label='דוא"ל' color="primary"
                                    error={loginFormik.touched.email && loginFormik.errors.email ? true : false}
                                    {...loginFormik.getFieldProps('email')}
                                    helperText={loginFormik.touched.email && loginFormik.errors.email ? loginFormik.errors.email : null}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <EmailIcon className={styles.fillInfoEmailIcon}></EmailIcon>
                                            </InputAdornment>
                                        ),
                                    }} />
                                <TextField className={styles.fillInfoPassword} id="password" label='סיסמא' color="primary"
                                    type={showPassword ? 'text' : 'password'}
                                    error={loginFormik.touched.password && loginFormik.errors.password ? true : false}
                                    {...loginFormik.getFieldProps('password')}
                                    helperText={loginFormik.touched.password && loginFormik.errors.password ? loginFormik.errors.password : null}
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
                                                <LockIcon className={styles.fillInfoPasswordIcon}></LockIcon>
                                            </InputAdornment>
                                        ),
                                    }} />
                            </div>
                        </form>
                        <div className={styles.fillInfoButtons}>
                            <Button className={styles.fillInfoJoin} onClick={loginFormik.handleSubmit} color="primary">
                                התחברות
                        </Button>

                            <Button className={styles.fillInfoCancel} onClick={handleChangeToSignup} color="primary">
                                הרשמה
                        </Button>
                        </div>
                    </div>
                    :
                    <div className={styles.dialogContent}>
                        <DialogTitle className={styles.title} id="customized-dialog-title" onClose={handleClose}>
                            הרשמה </DialogTitle>
                        <form className={styles.fillInfoForm} noValidate autoComplete="off">
                            <div className={styles.fillInfoDetails}>
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
                                <TextField className={styles.fillInfoPassword} id="password" label='סיסמא' color="primary"
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
                                                <LockIcon className={styles.fillInfoPasswordIcon}></LockIcon>
                                            </InputAdornment>
                                        ),
                                    }} />
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
                            </div>
                        </form>
                        <div className={styles.fillInfoButtons}>
                            <Button className={styles.fillInfoJoin} onClick={formik.handleSubmit} color="primary">
                                הרשמה
                            </Button>

                            <Button className={styles.fillInfoCancel} onClick={handleChangeToLogin} color="primary">
                                התחברות
                            </Button>
                        </div>
                    </div>
                }
            </Dialog>
            {/* <div style={{ paddingTop: "5px" }}>
                {rideTypeID === REQUEST_RIDE_ID + "" ? "ההצעה אושרה בהצלחה"
                :
                rideTypeID === OFFER_RIDE_ID + "" ? "הבקשה אושרה בהצלחה"
                : "הדף המבוקש אינו נמצא" }
            </div> */}
        </div>
    )
}