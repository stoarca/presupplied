import React from 'react';
import {Link} from 'react-router-dom';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {useStudentContext} from './StudentContext';
import {typedFetch} from './typedFetch';

type NavBarProps = Record<string, never>
export let NavBar = (props: NavBarProps) => {
  let student = useStudentContext();

  let navLinks;
  let saveWarning;
  let [showUserMenu, setShowUserMenu] = React.useState(false);
  let userMenuRef = React.useRef<HTMLButtonElement | null>(null);
  let handleToggleUserMenu = React.useCallback(() => {
    setShowUserMenu((old) => !old);
  }, []);
  let handleLogout = React.useCallback(async () => {
    await typedFetch({
      endpoint: '/api/auth/logout',
      method: 'post',
    });
    window.location.href = '/';
  }, []);
  let [showSaveWarning, setShowSaveWarning] = React.useState(true);
  let handleCloseWarning = React.useCallback((e: React.SyntheticEvent) => {
    setShowSaveWarning(false);
  }, []);
  if (student.dto) {
    navLinks = (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button ref={userMenuRef}
              onClick={handleToggleUserMenu}
              sx={{ p: 0, color: '#111111' }}
              endIcon={<ExpandMoreIcon/>}>
            {student.dto.email}
          </Button>
        </Tooltip>
        <Menu
            sx={{ mt: '30px' }}
            id="menu-appbar"
            anchorEl={userMenuRef.current}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={showUserMenu}
            onClose={handleToggleUserMenu}>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
    saveWarning = null;
  } else {
    navLinks = (
      <React.Fragment>
        <Button href="/login">Login</Button>
        <Button href="/register">Register</Button>
      </React.Fragment>
    );
    if (showSaveWarning) {
      saveWarning = (
        <AppBar position="static" color="default" style={{flex: '0 0 auto'}}>
          <Alert severity="warning" onClose={handleCloseWarning}>
            Your progress is saved locally in this browser.
            {' '}<Link to="/login">Login</Link> to sync to other devices.
          </Alert>
        </AppBar>
      );
    }
  }

  return (
    <React.Fragment>
      <AppBar position="static" color="default" style={{flex: '0 0 auto'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow:1}}>
            <img src="/static/images/logodark.svg" style={{height: '30px'}}/>
          </Typography>
          {navLinks}
        </Toolbar>
      </AppBar>
      {saveWarning}
    </React.Fragment>
  );
};
