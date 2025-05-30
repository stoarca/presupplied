import React, { CSSProperties, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem, Menu, Tooltip } from '@mui/material';

import { buildGraph } from '../dependency-graph';
import { moduleComponents } from '../ModuleContext';
import { NavBar } from '../components/NavBar';
import { useUserContext } from '../UserContext';
import {
  ProgressStatus, KNOWLEDGE_MAP, UserType, ModuleType, ChildInfoWithProgress
} from '../../../common/types';
import { isModuleForAdults } from '../../../common/utils';
import { ExpandMoreTwoTone } from '@mui/icons-material';
import { API_HOST, typedFetch } from '../typedFetch';
import { Card } from '../components/Card';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export let HomePage = () => {
  let user = useUserContext();
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

  const { reachable, childrenReachableSets } = React.useMemo(() => {
    if (!user.dto) {
      const userPassed = new Set(
        Object.entries(user.progress()).filter(
          ([k, v]) => v.status === ProgressStatus.PASSED
        ).map(([k, v]) => k)
      );

      const result = knowledgeGraph.getReachables('hybrid', userPassed, new Map());

      return {
        reachable: result.reachable,
        childrenReachableSets: new Map<number, Set<string>>()
      };
    }

    const userPassed = new Set(
      Object.entries(user.progress()).filter(
        ([k, v]) => v.status === ProgressStatus.PASSED
      ).map(([k, v]) => k)
    );

    const childrenReachedSets = new Map<number, Set<string>>();
    if (user.dto.children) {
      user.dto.children.forEach(child => {
        const childPassed = new Set(
          Object.entries(child.progress).filter(
            ([k, v]) => v.status === ProgressStatus.PASSED
          ).map(([k, v]) => k)
        );
        childrenReachedSets.set(child.id, childPassed);
      });
    }

    // Self-registered students (no adults) should use 'hybrid' mode to see all module types
    const userType = user.dto.type === UserType.STUDENT && (!user.dto.adults || user.dto.adults.length === 0)
      ? 'hybrid'
      : user.dto.type;

    const result = knowledgeGraph.getReachables(userType, userPassed, childrenReachedSets);

    return {
      reachable: result.reachable,
      childrenReachableSets: result.childrenReachableSets
    };
  }, [user.dto, user, knowledgeGraph]);

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

  const isStudent = user.dto?.type === UserType.STUDENT;
  const moduleCount = reachableAndImplemented.size;

  let containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    gap: '20px',
    justifyContent: moduleCount > 2 ? 'flex-start' : 'center',
    alignItems: 'center',
    flexDirection: isSmallDevice ? 'column' : 'row',
    paddingLeft: moduleCount > 2 && !isSmallDevice ? '20vw' : '0px',
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


  let buttonStyle = {
    padding: '5px 15px',
    background: 'linear-gradient(to right,rgba(255, 179, 0, 0.08),rgba(255, 162, 0, 0.15))',
    boxShadow: '0px 4px 6px #94DEA5',
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
  if (user.dto) {
    navLinks = (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button ref={userMenuRef}
            onClick={handleToggleUserMenu}
            sx={{ p: 0, color: '#111111' }}
            endIcon={<ExpandMoreTwoTone />}>
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
      position: 'relative',
      overflow: 'hidden'
    }}>
      <NavBar />
      <div style={containerStyle} onWheel={handleScroll}>
        {moduleCount === 0 && (
          <h1 data-test="no-modules-message" style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', color: '#fff', maxWidth: '50vw', textAlign: 'center', justifyContent: 'center' }}>
            {isStudent
              ? 'No modules available for you at this time. Check back soon!'
              : 'No modules available yet. Complete student modules to unlock teacher content.'}
          </h1>
        )}

        {Array.from(reachableAndImplemented).map(kmid => {
          let node = knowledgeGraph.getNodeData(kmid);

          // Only filter modules for students who have adults managing them
          const hasAdultManagement = user.dto && isStudent && user.dto.adults && user.dto.adults.length > 0;
          if (hasAdultManagement && isModuleForAdults(node.moduleType)) {
            return null;
          }

          let relevantChildren: ChildInfoWithProgress[] = [];
          if (node.moduleType === ModuleType.CHILD_DELEGATED && user.dto?.children) {
            relevantChildren = user.dto.children.filter(child => {
              const childReachable = childrenReachableSets.get(child.id);
              return childReachable?.has(kmid) || false;
            });
          }

          return (
            <div
              key={kmid}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                margin: '20px 10px',
                boxSizing: 'border-box',
                minWidth: `calc(${isSmallDevice ? '90vw' : window.innerWidth > 1000 ? '35vw' : '45vw'})`,
                maxWidth: '90vw'
              }}>
              <Card kmid={kmid} user={user} relevantChildren={relevantChildren} />
            </div>
          );
        })}
      </div>

      <Typography variant="h6" component="div" sx={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <img src="/static/images/logodark.svg" style={{ height: '30px' }} />
      </Typography>
    </div>
  );
};
