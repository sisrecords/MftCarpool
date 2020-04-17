import React from 'react';
import RideDialog from "./RideDialog";

export default function ViewRideDialog(props) {
    return (
        <div style={{
            height: "100vh", width: "100vw", backgroundRepeat: "no-repeat", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(/images/car-2158284.svg)`
            // backgroundImage: `url("https://cdn.pixabay.com/photo/2017/03/20/04/57/truck-2158284_960_720.png")`
        }}>
            <RideDialog {...props}></RideDialog>
        </div>
    )
}