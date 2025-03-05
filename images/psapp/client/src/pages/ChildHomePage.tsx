import React, { CSSProperties, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert, MenuItem, Menu, Tooltip } from '@mui/material';

import { buildGraph } from '../dependency-graph';
import { moduleComponents } from '../ModuleContext';
import { useStudentContext } from '../StudentContext';
import {
  ProgressStatus, KNOWLEDGE_MAP
} from '../../../common/types';
import { ExpandMoreTwoTone, SupervisorAccountTwoTone } from '@mui/icons-material';
import { API_HOST, typedFetch } from '../typedFetch';
import { Card } from '../components/Card';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export let ChildHomePage = () => {
  let student = useStudentContext();
  let [reached, setReached] = React.useState(new Set<string>( // eslint-disable-line
    Object.entries(student.progress()).filter(
      ([k, v]) => v.status === ProgressStatus.PASSED
    ).map(([k, v]) => k)
  ));
  let [showUserMenu, setShowUserMenu] = React.useState(false);
  let [supervisorModalOpen, setSupervisorModalOpen] = React.useState(false); // State for supervisor modal
  let [code, setCode] = React.useState('');
  let [notificationOpen, setNotificationOpen] = React.useState(false);
  let userMenuRef = React.useRef<HTMLButtonElement | null>(null);
  let navigate = useNavigate();

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

  let handleSupervisorButtonClick = React.useCallback(() => {
    setSupervisorModalOpen(true);
  }, []);

  let handleSupervisorModalClose = React.useCallback(() => {
    setSupervisorModalOpen(false);
  }, []);

  let handleCodeSubmit = React.useCallback(() => {
    if (code === '4000') {
      navigate('/');
    } else {
      setNotificationOpen(true);
    }
  }, [code, navigate]);

  let handleNotificationClose = React.useCallback(() => {
    setNotificationOpen(false);
  }, []);

  let reachable = React.useMemo(() => {
    let ret = knowledgeGraph.getReachable(reached);
    return ret;
  }, [reached]);

  let reachableAndImplemented = React.useMemo(() => {
    return new Set(Array.from(reachable).filter(x => !!moduleComponents[x]));
  }, [reachable]);

  let [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    gap: '20px',
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'center',
    flexDirection: isSmallDevice ? 'column' : 'row',
    // padding: '10px',
    paddingLeft: !isSmallDevice ? '80px' : '0',
    scrollBehavior: 'smooth',
    overflowX: isSmallDevice ? 'hidden' : 'auto',
    overflowY: isSmallDevice ? 'auto' : 'hidden',
    whiteSpace: isSmallDevice ? 'normal' : 'nowrap',
    boxSizing: 'border-box', // Ensure padding and border are included in the element's total width and height
  };

  // Handle vertical scrolling with the mouse to scroll horizontally
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isSmallDevice) {
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  let pillButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(211, 211, 211, 0.86)', // Light gray with 50% transparency
    border: '2px solid lightgray',
    borderRadius: '50px',
    padding: '10px 20px',
    cursor: 'pointer',
    zIndex: 1000,
    color: 'black',
    gap: '10px',
    display: 'flex',
  };

  let buttonStyle = {
    padding: '5px 15px',
    background: 'linear-gradient(to right,rgba(255, 179, 0, 0.08),rgba(255, 162, 0, 0.15))',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '900',
    color: 'rgba(62, 66, 8, 0.94)',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  };

  let navLinks;
  if (student.dto) {
    navLinks = (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button ref={userMenuRef}
            onClick={handleToggleUserMenu}
            sx={{ p: 0, color: '#111111' }}
            endIcon={<ExpandMoreTwoTone />}>
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
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  } else {
    navLinks = ( // eslint-disable-line
      <React.Fragment>
        <div style={buttonContainerStyle}>
          <Button variant="contained"
            component={Link}
            to="/login"
            style={buttonStyle}
          >
            Login
          </Button>
          <Button variant="contained"
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      position: 'relative', // Ensure child circles can be positioned
      overflow: 'hidden' // Prevent circles from overflowing
    }}>
      {/* Green Gradient Circles */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(110, 241, 176, 0.66), rgba(0,255,128,0.1))',
        borderRadius: '50%',
        top: '10%',
        left: '5%',
        zIndex: 0,
      }}></div>

      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(37, 226, 131, 0.5), rgba(0,255,128,0.1))',
        borderRadius: '50%',
        bottom: '15%',
        right: '10%',
        zIndex: 0,
      }}></div>

      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(0, 255, 55, 0.4), rgba(137, 241, 189, 0.1))',
        borderRadius: '50%',
        bottom: '30%',
        left: '40%',
        zIndex: 0,
      }}></div>

      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(135, 223, 179, 0.5), rgba(0,255,128,0.1))',
        borderRadius: '50%',
        bottom: '20%',
        left: '80%',
        zIndex: 0,
      }}></div>

      <div style={{
      }}><img src="/static/images/cartoon/sword.svg" style={{
          height: '20rem',
          position: 'absolute',
          bottom: '-5%',
          left: '78%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }} /></div>

      {/* <NavBar /> */}
      <div style={containerStyle} onWheel={handleScroll}>
        {Array.from(reachableAndImplemented).map(kmid => {
          let node = knowledgeGraph.getNodeData(kmid);
          if (node.forTeachers) {return null;}
          let cardStyle = { backgroundImage: `url(${'../../static/images/misc/card-bg.jpeg'})` };

          return (
            <Grid item
              key={kmid}
              xs={12} sm={8} md={6} lg={5} xl={4}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                margin: '20px 10px',
                boxSizing: 'border-box',
                minWidth: `calc(${isSmallDevice ? '90vw' : window.innerWidth > 1000 ? '35vw' : '60vw'})`,
                maxWidth: '90vw'
              }}>
              <Card kmid={kmid} student={student} style={cardStyle} />
            </Grid>
          );
        })}
      </div>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, position: 'absolute', bottom: '0%', right: '45%' }}>
        <img src="/static/images/logodark.svg" style={{ height: '30px' }} />
      </Typography>

      <Button style={pillButtonStyle} onClick={handleSupervisorButtonClick}>
        <SupervisorAccountTwoTone /> Supervisor
      </Button>

      <Modal open={supervisorModalOpen} onClose={handleSupervisorModalClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          backdropFilter: 'blur(10px)', // Blur the background
        }}>
          <Typography variant="subtitle1" component="h2" gutterBottom sx={{ color: 'gray', textAlign: 'left' }}>
            Enter Supervisor Code
          </Typography>
          <Box sx={{ display: 'flex', justparsifyContent: 'space-between', mb: 2 }}>
            {[0, 1, 2, 3].map((_, index) => (
              <TextField
                key={index}
                variant="outlined"
                autoFocus={index === 0}
                type="text"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' },
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: '3rem', borderColor: 'lightgray' }}
                value={code[index] || ''}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^0-9]/g, '');
                  if (value || value === '') {
                    let newCode = code.split('');
                    newCode[index] = value;
                    setCode(newCode.join(''));
                    if (value && index < 3) {
                      document.getElementById(`code-input-${index + 1}`)?.focus();
                    }
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && !code[index] && index > 0) {
                    document.getElementById(`code-input-${index - 1}`)?.focus();
                  } else if (event.key === 'Enter' && index === 3) {
                    handleCodeSubmit();
                  }
                }}
                id={`code-input-${index}`}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCodeSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={handleNotificationClose}>
        <Alert onClose={handleNotificationClose} severity="error" sx={{ width: '100%' }}>
          Wrong code, please try again.
        </Alert>
      </Snackbar>
    </div>
  );
};
