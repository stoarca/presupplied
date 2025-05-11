import React, { CSSProperties, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ExpandMore } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { AccountTreeTwoTone, Close as CloseIcon, ChildCare } from '@mui/icons-material';
import { ChildCreator } from './ChildCreator';
import { UserType } from '../../../common/types';
import { AccountSwitcher } from './AccountSwitcher';
import { Avatar } from './Avatar';

type NavBarProps = Record<string, never>
export let NavBar = (props: NavBarProps) => {
  let navigate = useNavigate();
  let user = useUserContext();
  let location = window.location.pathname;
  let [showAddChildDialog, setShowAddChildDialog] = React.useState(false);
  let [showAccountSwitcher, setShowAccountSwitcher] = React.useState(false);

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

  let handleOpenAddChild = React.useCallback(() => {
    setShowAddChildDialog(true);
    setShowUserMenu(false);
  }, []);

  let handleOpenAccountSwitcher = React.useCallback(() => {
    setShowAccountSwitcher(true);
    setShowUserMenu(false);
  }, []);

  let handleToggleMapView = React.useCallback(() => {
    navigate(location === '/map' ? '/' : '/map');
    setShowUserMenu(false);
  }, [location, navigate]);

  let handleChildCreationComplete = React.useCallback(() => {
    setShowAddChildDialog(false);
    // Reload the page to show the new child
    window.location.reload();
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
  if (user.dto) {
    const isStudentWithParents = user.dto.type === UserType.STUDENT && user.dto.parents && user.dto.parents.length > 0;

    if (!isStudentWithParents) {
      navLinks = (
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Account">
            <Button ref={userMenuRef}
              onClick={handleToggleUserMenu}
              sx={{ p: 0, color: '#023D54' }}
              endIcon={<ExpandMore />}
              data-test="user-display-email">
              {user.dto.email}
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
            {!(user.dto?.type === UserType.PARENT || user.dto?.type === UserType.TEACHER) ||
             (user.dto?.children && user.dto?.children.length > 0) && (
              <>
                {(user.dto?.type === UserType.PARENT || user.dto?.type === UserType.TEACHER) && (
                  <MenuItem onClick={handleOpenAddChild} data-test="add-child-button">
                    <Typography textAlign="center">Add Child</Typography>
                  </MenuItem>
                )}
                {(user.dto?.type === UserType.PARENT || user.dto?.type === UserType.TEACHER) &&
                 user.dto?.children && user.dto?.children.length > 0 && (
                  <MenuItem onClick={handleOpenAccountSwitcher} data-test="child-mode-button">
                    <Typography textAlign="center">Child Mode</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleToggleMapView}>
                  <Typography textAlign="center">
                    {location === '/map' ? 'Home View' : 'Map View'}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleOpenSettings}>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
              </>
            )}
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      );
    } else {
      navLinks = (
        <Box
          sx={{
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 0.5,
            padding: '12px 0 8px 0'
          }}
        >
          <Avatar
            userType={UserType.STUDENT}
            profilePicture={user.dto.profilePicture}
            size={55}
            onClick={handleOpenAccountSwitcher}
            data-test="user-avatar"
          />
          <Typography 
            data-test="user-display-name"
            sx={{
              color: '#023D54',
              fontSize: '1.15rem',
              fontWeight: 700,
              marginTop: '2px',
              letterSpacing: '0.01em'
            }}>
            {user.dto.name}
          </Typography>
        </Box>
      );
    }
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
          <div style={{ flexGrow: 1 }}></div>
          {navLinks}
        </Toolbar>
      </AppBar>
      {showAddChildDialog && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto'
          }}
        >
          <ChildCreator
            onComplete={handleChildCreationComplete}
            showCloseButton={true}
            onClose={() => setShowAddChildDialog(false)}
          />
        </Box>
      )}

      <AccountSwitcher
        open={showAccountSwitcher}
        onClose={() => setShowAccountSwitcher(false)}
      />
    </React.Fragment>
  );
};
