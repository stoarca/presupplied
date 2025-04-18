import React, { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

import { useStudentContext } from '../StudentContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { AccountTreeTwoTone } from '@mui/icons-material';

type NavBarProps = Record<string, never>
export let NavBar = (props: NavBarProps) => {
  let navigate = useNavigate();
  let student = useStudentContext();
  let location = window.location.pathname; // Add this line

  let navLinks;
  let saveWarning;
  let [showUserMenu, setShowUserMenu] = React.useState(false);
  let userMenuRef = React.useRef<HTMLButtonElement | null>(null);
  let handleToggleUserMenu = React.useCallback(() => {
    setShowUserMenu((old) => !old);
  }, []);
  let handleLogout = React.useCallback(async () => {
    await typedFetch({
      host: API_HOST,
      endpoint: '/api/auth/logout',
      method: 'post',
    });
    window.location.href = '/';
  }, []);
  let [showSaveWarning, setShowSaveWarning] = React.useState(true);
  let handleCloseWarning = React.useCallback((e: React.SyntheticEvent) => {
    setShowSaveWarning(false);
  }, []);

  let handleOpenSettings = React.useCallback((e: React.SyntheticEvent) => {
    setShowSaveWarning(false);
  }, []);

  let buttonStyle = {
    backgroundColor: '#023D54',
    padding: '5px 15px',
    // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  };

  if (showSaveWarning) {
    saveWarning = (
      <AppBar position="static" color="default" style={{ flex: '0 0 auto', alignItems: 'center' }}>
        <Alert severity="warning" onClose={handleCloseWarning}>
          Your progress is saved locally in this browser.
          {' '}<Link to="/login" style={{color: '#023D54'}}>Login</Link> to sync to other devices.
        </Alert>
      </AppBar>
    );
  }
  if (student.dto) {
    navLinks = (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Logout">
          <Button ref={userMenuRef}
            onClick={handleToggleUserMenu}
            sx={{ p: 0, color: '#023D54' }}
            endIcon={<ExpandMoreIcon />}>
            {student.dto.email}
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: '30px' }}
          id="menu-appbar"
          anchorEl={userMenuRef.current}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={showUserMenu}
          onClose={handleToggleUserMenu}>
          <MenuItem onClick={handleOpenSettings}>
            <Typography textAlign="center">Settings</Typography>
          </MenuItem>
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
        <div style={buttonContainerStyle}>
          <Button variant="outlined"
            component={Link}
            to="/login"
            sx={{color: '#023D54'}}
          // style={buttonStyle}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            style={buttonStyle}
          >
            Register
          </Button>
        </div>
      </React.Fragment>
    );

  }

  return (
    <React.Fragment>
      {saveWarning}
      <AppBar position="static" style={{ flex: '0 0 auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => { navigate(location === '/map' ? '/' : '/map'); }} sx={{ backgroundColor: 'rgba(0, 255, 13, 0.09)', padding: '5px 15px', borderRadius: '2px', gap: '10px', color: '#023D54', border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease-in-out', ':hover': { textDecoration: 'underline', backgroundColor: 'rgba(0, 255, 13, 0.21)' } }}>
            <AccountTreeTwoTone /> Map View
          </Button>
          <Button>
            {navLinks}
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
