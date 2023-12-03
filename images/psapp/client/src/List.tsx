import React from 'react';
import {Link} from 'react-router-dom';

import Button from '@mui/material/Button';
import MovieIcon from '@mui/icons-material/LiveTv';
import StarIcon from '@mui/icons-material/Star';
import Grid from '@mui/material/Grid';

import {buildGraph, TechTree} from './dependency-graph';
import {moduleComponents} from './ModuleContext';
import {NavBar} from './NavBar';
import {useStudentContext} from './StudentContext';
import {ProgressStatus, KNOWLEDGE_MAP} from '../../common/types';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export let List = () => {
  let student = useStudentContext();
  let [reached, setReached] = React.useState(new Set<string>(
    Object.entries(student.progress()).filter(
      ([k, v]) => v.status === ProgressStatus.PASSED
    ).map(([k, v]) => k)
  ));
  let handleChangeReached = React.useCallback((newReached: Set<string>) => {
    setReached(newReached);
  }, []);

  let reachable = React.useMemo(() => {
    let ret = knowledgeGraph.getReachable(reached);
    return ret;
  }, [reached]);

  let reachableAndImplemented = React.useMemo(() => {
    return new Set(Array.from(reachable).filter(x => !!moduleComponents[x]));
  }, [reachable]);

  let cards = Array.from(reachableAndImplemented).map(kmid => {
    let node = knowledgeGraph.getNodeData(kmid);
    let backgroundFile = node.forTeachers ? 'for_teachers' : kmid;
    let shadow = '2px 2px 3px #00000033';
    let innerStyle = {
      display: 'flex',
      alignItems: 'center',
      aspectRatio: '2/1',
      background: `url('/static/images/module_cards/${backgroundFile}.png')`,
      backgroundSize: 'contain',
      fontFamily: 'Handlee, sans-serif',
      color: '#221111',
      borderRadius: '4px',
      paddingLeft: '20px',
      paddingRight: '150px',
      boxShadow: shadow,
    };
    let buttonStyle = {
      width: '100%',
      padding: '20px',
      background: 'linear-gradient(to right, #08c953, #24d669)',
      boxShadow: shadow,
    };
    let videoButton;
    if (
      node.forTeachers && node.teacherVideos.length ||
          !node.forTeachers && node.studentVideos.length
    ) {
        videoButton = (
          <Grid item xs={6}>
            <Button variant="contained"
                color="success"
                style={buttonStyle}>
              <MovieIcon sx={{fontSize: '40px'}}/>
            </Button>
          </Grid>
        );
    } else {
      videoButton = null;
    }
    return (
      <Grid item
          key={kmid}
          xs={12} sm={8} md={6} lg={5} xl={4}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link to={`/modules/${kmid}`} style={{textDecoration: 'none'}}>
              <div style={innerStyle}>
                <h1>
                  {node.title}
                </h1>
              </div>
            </Link>
          </Grid>
          {videoButton}
          <Grid item xs={videoButton ? 6 : 12}>
            <Button variant="contained"
                component={Link}
                to={`/modules/${kmid}`}
                color="success"
                style={buttonStyle}>
              <StarIcon sx={{fontSize: '40px'}}/>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  });

  let containerStyle: React.CSSProperties = {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '10px',
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <NavBar/>
      <div style={containerStyle}>
        <Grid container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100%' }}>
          {cards}
        </Grid>
      </div>
    </div>
  );
};
