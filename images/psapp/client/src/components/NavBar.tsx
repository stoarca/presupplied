import React, { CSSProperties } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ExpandMore } from '@mui/icons-material';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { typedLocalStorage } from '../typedLocalStorage';
import { UserType } from '../../../common/types';
import { AccountSwitcher } from './AccountSwitcher';
import { Avatar } from './Avatar';

type NavBarProps = Record<string, never>
export let NavBar = (props: NavBarProps) => {
  let user = useUserContext();
  let location = window.location.pathname;
  let [showAccountSwitcher, setShowAccountSwitcher] = React.useState(false);

  let navLinks;
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
  let [showSaveWarning, setShowSaveWarning] = React.useState(() => {
    const dismissedAt = typedLocalStorage.getJson('saveWarningDismissedAt');
    if (!dismissedAt) {
      return true;
    }
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return dismissedAt < oneDayAgo;
  });

  let handleCloseWarning = React.useCallback((e: React.SyntheticEvent) => {
    setShowSaveWarning(false);
    typedLocalStorage.setJson('saveWarningDismissedAt', Date.now());
  }, []);


  let handleCloseUserMenu = React.useCallback(() => {
    setShowUserMenu(false);
  }, []);

  let handleOpenAccountSwitcher = React.useCallback(() => {
    setShowAccountSwitcher(true);
    setShowUserMenu(false);
  }, []);


  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  };

  if (user.dto) {
    if (user.isSelfManaged()) {
      navLinks = (
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Account">
            <Button ref={userMenuRef}
              onClick={handleToggleUserMenu}
              sx={{ p: 0, color: 'text.primary' }}
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
            {[
              <MenuItem
                key="settings"
                onClick={handleCloseUserMenu}
                data-test="menu-item-settings"
              >
                <RouterLink to="/settings/general" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <Typography textAlign="center">Settings</Typography>
                </RouterLink>
              </MenuItem>
            ].filter(Boolean)}
            <MenuItem onClick={handleLogout} data-test="menu-item-logout">
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
              color: 'text.primary',
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
  } else {
    navLinks = (
      <React.Fragment>
        <div style={buttonContainerStyle}>
          <Button variant="outlined"
            component={RouterLink}
            to="/login"
            sx={{color: 'text.primary'}}
            data-test="login-button-navbar"
          // style={buttonStyle}
          >
            Login
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/register"
          >
            Register
          </Button>
        </div>
      </React.Fragment>
    );

  }

  return (
    <React.Fragment>
      <AppBar position="static" style={{ flex: '0 0 auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!user.dto && showSaveWarning && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
              py: 1
            }}>
              <Alert
                severity="warning"
                onClose={handleCloseWarning}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.5,
                  fontSize: '0.875rem'
                }}
              >
                Your progress is saved locally in this browser.
                {' '}<Link component={RouterLink} to="/login" sx={{color: 'text.primary', textDecoration: 'underline'}} data-test="login-link-warning">Login</Link> to sync to other devices.
              </Alert>
            </Box>
          )}
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}></div>

            <Box sx={{
              display: 'flex',
              gap: 2,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Button
                component={RouterLink}
                to="/"
                sx={{
                  color: 'text.primary',
                  fontWeight: location === '/' ? 700 : 400,
                  '&:hover': {
                    fontWeight: 600,
                    backgroundColor: 'transparent'
                  }
                }}
                data-test="nav-button-home"
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/map"
                sx={{
                  color: 'text.primary',
                  fontWeight: location === '/map' ? 700 : 400,
                  '&:hover': {
                    fontWeight: 600,
                    backgroundColor: 'transparent'
                  }
                }}
                data-test="nav-button-map"
              >
                Map
              </Button>
              {user.dto && (user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER) && (
                <Button
                  component={RouterLink}
                  to="/children"
                  sx={{
                    color: 'text.primary',
                    fontWeight: location === '/children' ? 700 : 400,
                    '&:hover': {
                      fontWeight: 600,
                      backgroundColor: 'transparent'
                    }
                  }}
                  data-test="nav-button-children"
                >
                  Children
                </Button>
              )}
            </Box>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {navLinks}
            </div>
          </Toolbar>
        </Box>
      </AppBar>

      <AccountSwitcher
        open={showAccountSwitcher}
        onClose={() => setShowAccountSwitcher(false)}
      />
    </React.Fragment>
  );
};
