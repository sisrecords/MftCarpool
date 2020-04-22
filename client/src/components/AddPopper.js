import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import styles from './buttons.module.css';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import AddRequest from './AddRequest';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AddOffer from './AddOffer';
// const useStyles = makeStyles(theme => ({
//   typography: {
//     padding: theme.spacing(2),
//   },
// }));

export default function AddPopper(props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openRequest, setOpenRequest] = useState(false);
  const [openOffer, setOpenOffer] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setOpen(open => !open);
    setAnchorEl(event.currentTarget);
  }

  const handleRequestClick = (event) => {
    setOpenRequest(openRequest => !openRequest);
  }

  const handleOfferClick = (event) => {
    setOpenOffer(openOffer => !openOffer);
  }

  function closeRequestDialog(ride) {
    setOpenRequest(false);
    props.onClose(ride);
  }

  function closeOfferDialog(ride) {
    setOpenOffer(false);
    props.onClose(ride);
  }

  function cancelRequestDialog() {
    setOpenRequest(false);
  }

  function cancelOfferDialog() {
    setOpenOffer(false);
  }

  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {popupState => (
        <div>
          {
            openRequest ?
              <AddRequest open={true} onClose={closeRequestDialog} onCancel={cancelRequestDialog} /> : null
          }
          {
            openOffer ?
              <AddOffer open={true} onClose={closeOfferDialog} onCancel={cancelOfferDialog}/> : null
          }
          <Button className={styles.addRide} variant="contained" onClick={handleClick} >
            <AddIcon className={styles.addIcon}></AddIcon>
          </Button>

          <Popper {...bindPopper(popupState)} anchorEl={anchorEl} placement="right" transition className={styles.popper} open={open}>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Fade {...TransitionProps} timeout={350}>
                  <div className={styles.addReqOrOff}>

                    <Button className={styles.offRide} onClick={handleOfferClick}>
                      <DriveEtaIcon className={styles.addNewButtons} />
                    </Button>
                    <Button className={styles.reqRide} onClick={handleRequestClick}>
                      <EmojiPeopleIcon className={styles.addNewButtons} /> </Button>

                  </div>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
}