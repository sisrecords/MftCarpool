import React from 'react';
import { useParams } from "react-router-dom";
import { REQUEST_RIDE_ID, OFFER_RIDE_ID } from '../entities/ride';

export default function OccupiedRidePage(props) {
    let { rideTypeID } = useParams();
    return (
        <div style={{
            height: "100vh", width: "100vw", backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(/images/car-2158284.svg)`
        }}>
            <div style={{ paddingTop: "5px" }}>
                {rideTypeID === REQUEST_RIDE_ID + "" ? "ההצעה אושרה בהצלחה"
                :
                rideTypeID === OFFER_RIDE_ID + "" ? "הבקשה אושרה בהצלחה"
                : "הדף המבוקש אינו נמצא" }
            </div>
        </div>
    )
}