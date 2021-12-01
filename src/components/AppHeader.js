import React from 'react';
import {AppBar, Toolbar, Typography, withStyles,} from '@material-ui/core';

import LoginButton from './LoginButton';

const styles = {
  flex: {
    flex: 1,
  },
};

const AppHeader = ({classes}) => (
  <AppBar position="static">
    <Toolbar>
      <img src="/icon.png" alt="logo" style={{maxHeight: 80}}/>
      <Typography variant="h6" color="inherit">
        Room Plays
      </Typography>
      <div className={classes.flex}/>
      <LoginButton/>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);
