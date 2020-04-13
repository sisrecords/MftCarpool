import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { useDebounce } from "use-debounce";
import Button from '@material-ui/core/Button';
import styles from './map.module.css';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
    fontWeight: "bold",
    direction: "rtl"
  },
}))(Tooltip);

const ExampleMap = (props) => {
  const [editMode, setEditMode] = useState(props.latitude && props.longitude && props.input ? true : false);
  const [lat, setLat] = useState(editMode ? props.latitude : 32.11);
  const [lng, setLng] = useState(editMode ? props.longitude : 34.855);
  const [zoom, setZoom] = useState(editMode ? 17 : 11);
  const [marker, setMarker] = useState(editMode ? [props.latitude, props.longitude] : []);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState(editMode ? props.input : "");
  const [debouncedInput] = useDebounce(input, 350);
  const [first, setFirst] = useState(true);
  const [mapRef, setMapRef] = useState(null);
  const [showErrorFirstTime, setShowErrorFirstTime] = useState(false);

  useEffect(
    () => {
      if (first) {
        setFirst(false);
        return;
      }
      search(debouncedInput);
    },
    [debouncedInput]
  );

  const searchWithLatLon = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url)
      .then(res => res.json());
    let inputVal = formatLocationName(response.display_name, response.address);
    setInput(inputVal);
    setMarker([lat, lon]);
    if (!editMode) {
      props.onInputChange(inputVal);
      props.onMarkerChange(lat, lon);
    }
    if (!showErrorFirstTime) {
      setShowErrorFirstTime(true);
    }
    return response;
  }

  const search = async (query) => {
    console.log("query: ", query)
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1&countrycodes=il&q=`;
    const response = await fetch(url + query)
      .then(res => res.json());
    return formatResponse(response)
  }

  const formatResponse = (response) => {
    const noResultString = 'לא נמצאו תוצאות, אנא הקלד מילים שלמות';
    const resources = response;
    const onlyIsrael = resources.filter(e => e.address.country_code === "il");
    const count = onlyIsrael.length;
    const info = (count > 0) ? onlyIsrael.map(e => ({
      bounds: e.boundingbox.map(bound => Number(bound)),
      latitude: e.lat,
      longitude: e.lon,
      name: formatLocationName(e.display_name, e.address),
    })) : 'לא נמצאו תוצאות, אנא הקלד מילים שלמות';
    let res = [];
    if (info !== noResultString) {
      for (let elem of info) {
        res.push(elem);
      }
    }
    else {
      res = [];
    }
    setOptions(res);
  }

  const formatLocationName = (name, address) => {
    let fullName = name;
    if (address.house_number && address.road) {
      let houseNumberIndex = fullName.indexOf(address.house_number);
      let properHouseNumberAndRoad = address.road + ", " + address.house_number;
      let withoutHouseNumberAndRoad = fullName.replace(address.house_number + ", ", "").replace(address.road, "");
      fullName = withoutHouseNumberAndRoad.slice(0, houseNumberIndex) + properHouseNumberAndRoad + withoutHouseNumberAndRoad.slice(houseNumberIndex);
    }
    return fullName.replace(", " + address.postcode, "").replace(", " + address.residential, "").replace(", " + address.state, "").replace(", " + address.country, "");
  }

  const onInputChange = (event, val, reason) => {
    console.log("input: ", val)
    if (!event) {
      return;
    }
    if (event.type === "keydown" && val === "") {
      return;
    }
    let loc = options.find(e => e.name === val);
    console.log(loc);
    if (!loc) {
      setMarker([]);
      if (!editMode) {
        props.onMarkerChange(null, null);
      }
    }
    setInput(val);
    if (!editMode) {
      props.onInputChange(val);
    }
    if (!showErrorFirstTime) {
      setShowErrorFirstTime(true);
    }
  }

  const handleChange = (event, val) => {
    console.log("changed1: ", val);
    console.log("changed2: ", event);
    if (val && val.latitude && val.longitude) {
      setLat(val.latitude);
      setLng(val.longitude);
      setZoom(17);
      setMarker([val.latitude, val.longitude]);
      if (!editMode) {
        props.onMarkerChange(val.latitude, val.longitude);
      }
    }
    else {
      if (!val || val === "") {
        setMarker([]);
        if (!editMode) {
          props.onMarkerChange(null, null);
        }
      }
    }
  }

  const addMarker = (event) => {
    searchWithLatLon(event.latlng.lat, event.latlng.lng);
  }

  const filterOptions = (options, { inputValue }) => {
    return options;
  }

  const centerMap = () => {
    let map = mapRef.leafletElement;
    if (map) {
      if (marker[0] && marker[1]) {
        // if(mapRef.viewport.center[0] !== marker[0] || mapRef.viewport.center[1] !== marker[1]){
        map.flyTo([marker[0], marker[1]], 17)
        // }
      }
    }
  }

  return (
    <div className={styles.mapAndInputContainer}>
      <div className={styles.autocompleteWrapper}>
        {editMode ?
          <div className={styles.displayLocationName}>
            {props.input}
          </div>
          : <Autocomplete
            freeSolo
            openOnFocus
            inputValue={input}
            clearOnEscape={false}
            autoComplete
            options={options}
            getOptionLabel={option => option.name ? option.name : ""}
            onInputChange={onInputChange}
            onChange={handleChange}
            filterOptions={filterOptions}
            renderInput={params => (
              <LightTooltip title={input} aria-label="מיקום" placement="top-end">
                <TextField
                  {...params}
                  variant="standard"
                  label={props.label}
                  placeholder="הכנס את הכתובת"
                  margin="normal"
                  fullWidth
                  error={(input === "" || input === null || marker.length === 0) ? true : false}
                />
              </LightTooltip>
            )}
          />}
      </div>

      <Map
        center={[lat, lng]}
        zoom={zoom}
        doubleClickZoom={false}
        touchZoom={true}
        onDblClick={editMode ? () => { } : addMarker}
        ref={e => { setMapRef(e); }}
      // onpopupopen={onLocationSelected}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {marker.length > 0 ?
          <Marker position={[marker[0], marker[1]]}>
            {/* <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
          </Popup> */}
          </Marker> : null}
      </Map>
      {/* <div className={styles.centerButton}>
        <Button variant="contained" color="primary" onClick={centerMap} disabled={marker.length === 0}>
          למרכז המפה
        </Button>
      </div> */}
    </div>
  );
};

export default ExampleMap;