import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import styles from './ride.module.css';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';

function Ride(props) {
    return (
        <div className={styles.card} >
            <ListItem className={styles.listitem} key={props.itemRide.phone}>
                <Card className={styles.card}>
                    <div className={styles.fromTo}><img style={{ height: '45px' }} src='/images/from_to.png' alt="from_to" /></div>
                    {
                        (props.itemRide.request === '1') ?
                            <div className={styles.carIconReq}><EmojiPeopleIcon className={styles.carIcon} /></div>
                            : <div className={styles.carIconOff}><DriveEtaIcon className={styles.carIcon} /></div>
                    }
                    <div className={styles.addressFrom}>
                        {props.itemRide.address.street} {props.itemRide.address.num}
                    </div>
                    <div className={styles.cityFrom}>
                        {props.itemRide.address.city}
                    </div >
                    <div className={styles.addressTo}>
                        {props.itemRide.to.street} {props.itemRide.to.num}
                    </div>
                    <div className={styles.cityTo}>
                        {props.itemRide.to.city}
                    </div >
                    <div className={styles.locationIcon}>
                        <LocationOnIcon className={styles.locationOnIcon}/>
                    </div>
                    <div className={styles.distance}> {props.itemRide.distance} ק"מ</div>
                    <div className={styles.fromYou}>ממקומך</div>
                    <div className={styles.timeIcon}><AccessTimeIcon className={styles.accessTimeIcon}/></div>
                    <div className={styles.time}>{props.itemRide.time}</div>
                    <div className={styles.dateIcon}><EventIcon className={styles.eventIcon}/></div>
                    <div className={styles.date}>{props.itemRide.date}</div>
                </Card>
            </ListItem>
        </div>
    );
}

export default Ride;