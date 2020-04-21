import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import styles from './ride.module.css';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';
import { REQUEST_RIDE_ID } from '../entities/ride';

function RideCard(props) {
    return (
        <div className={styles.card} >
            <ListItem className={styles.listitem} key={props.itemRide.phone}>
                <Card className={styles.card}>
                    <div className={styles.fromTo}><img style={{ height: '45px' }} src='/images/from_to.png' alt="from_to" /></div>
                    {
                        (props.itemRide.rideTypeID === REQUEST_RIDE_ID) ?
                            <div className={styles.carIconReq}><EmojiPeopleIcon className={styles.carIcon} /></div>
                            : <div className={styles.carIconOff}><DriveEtaIcon className={styles.carIcon} /></div>
                    }
                    <div className={styles.addressFrom} title={props.itemRide.fromLocationWithoutCity}>
                        {
                            props.itemRide.fromLocationWithoutCity.length > 15 ?
                                props.itemRide.fromLocationWithoutCity.substring(0, 15) + "..."
                                : props.itemRide.fromLocationWithoutCity
                        }
                    </div>
                    <div className={styles.cityFrom}>
                        {props.itemRide.fromLocationCity}
                    </div >
                    <div className={styles.addressTo} title={props.itemRide.toLocationWithoutCity}>
                        {
                            props.itemRide.toLocationWithoutCity.length > 15 ?
                                props.itemRide.toLocationWithoutCity.substring(0, 15) + "..."
                                : props.itemRide.toLocationWithoutCity
                        }
                    </div>
                    <div className={styles.cityTo}>
                        {props.itemRide.toLocationCity}
                    </div >
                    <div className={styles.distanceContainer}>
                        <div className={styles.locationIcon}>
                            <LocationOnIcon className={styles.locationOnIcon} />
                        </div>
                        <div className={styles.distance}> {props.itemRide.distance} ק"מ</div>
                    </div>
                    <div className={styles.fromYouContainer}>
                        <div className={styles.fromYou}>ממקומך</div>
                    </div>
                    <div className={styles.timeContainer}>
                        <div className={styles.timeIcon}><AccessTimeIcon className={styles.accessTimeIcon} /></div>
                        <div className={styles.time}>{props.itemRide.time}</div>
                    </div>
                    <div className={styles.dateContainer}>
                        <div className={styles.dateIcon}><EventIcon className={styles.eventIcon} /></div>
                        <div className={styles.date}>{props.itemRide.date}</div>
                    </div>
                </Card>
            </ListItem>
        </div>
    );
}

export default RideCard;