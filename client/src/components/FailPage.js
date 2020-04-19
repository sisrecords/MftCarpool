import React from 'react';

export default function FailPage(props) {
    return (
        <div style={{
            height: "100vh", width: "100vw", backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(/images/car-2158284.svg)`
        }}>
            <div style={{ paddingTop: "5px" }}>
                חלה שגיאה בפעולה שניסית לבצע
            </div>
        </div>
    )
}