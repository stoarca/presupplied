import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

import Button from '@mui/material/Button';
import MovieIcon from '@mui/icons-material/LiveTv';
import StarIcon from '@mui/icons-material/Star';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';

import { buildGraph } from './dependency-graph';
import { moduleComponents } from './ModuleContext';
import { NavBar } from './NavBar';
import { useStudentContext, Student } from './StudentContext';
import {
  ProgressStatus, ProgressVideoStatus, KNOWLEDGE_MAP
} from '../../common/types';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

let extractYouTubeId = (url: string): string | null => {
  let regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
};

interface VideoModalProps {
  youtubeUrl: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  onDone: () => void;
  open: boolean;
}

let VideoModal = ({
  youtubeUrl, startTimeSeconds, endTimeSeconds, onDone, open
}: VideoModalProps) => {
  // TODO: This is quite messy because youtubeUrl is blank at the start
  // Should have a nicer way of handling this.
  if (!youtubeUrl) {
    return null;
  }
  let videoId = extractYouTubeId(youtubeUrl);

  let handleVideoStateChange = React.useCallback((event: YouTubeEvent) => {
    if (event.data === 0) { // data === 0 means video finished playing
      onDone();
    }
  }, []);

  if (!videoId) {
    console.error('failed to get video id');
    return null;
  }

  let style = {
    height: '100%',
    width: '100%',
  };
  let opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      start: startTimeSeconds,
      end: endTimeSeconds,
      controls: 1,
    },
  };
  return (
    <Modal open={open}>
      <div style={style}>
        <YouTube
          className="youtube100"
          videoId={videoId}
          opts={opts}
          onStateChange={handleVideoStateChange} />
      </div>
    </Modal>
  );
};

interface CardProps {
  kmid: string;
  student: Student;
};

let Card = ({ kmid, student }: CardProps) => {
  let node = React.useMemo(() => knowledgeGraph.getNodeData(kmid), [kmid]);
  let navigate = useNavigate();
  let [showModal, setShowModal] = React.useState(false);
  let [videoVanityId, setVideoVanityId] = React.useState('');
  let [youtubeUrl, setYoutubeUrl] = React.useState('');
  let _showVideo = React.useCallback(async (masteryIfAllWatched: boolean) => {
    let videos = node.forTeachers ? node.teacherVideos : node.studentVideos;
    let watchedVideos = await student.videos(kmid);
    setShowModal(true);
    console.log('in here');
    console.log(videos);
    console.log(watchedVideos);
    for (let v of videos) {
      if (watchedVideos[v.id] !== ProgressVideoStatus.WATCHED) {
        setYoutubeUrl(v.url);
        setVideoVanityId(v.id);
        return;
      }
    }
    if (masteryIfAllWatched) {
      navigate(`/modules/${kmid}`);
    } else {
      // TODO: once all the videos are watched, this should show a menu
      setYoutubeUrl(videos[0].url);
      setVideoVanityId(videos[0].id);
    }
  }, [kmid, node, student, navigate]);
  let showVideo = React.useCallback(() => {
    return _showVideo(false);
  }, [_showVideo]);
  let showVideoOrMasteryIfDone = React.useCallback(() => {
    return _showVideo(true);
  }, [_showVideo]);
  let handleDoneVideo = React.useCallback(async () => {
    await student.markWatched({
      [kmid]: {
        [videoVanityId]: ProgressVideoStatus.WATCHED,
      },
    });
    setShowModal(false);
  }, [kmid, student, videoVanityId]);
  let backgroundFile = node.forTeachers ? 'for_teachers' : kmid;
  let shadow = '2px 2px 3px #00000033';
  let innerStyle = {
    display: 'flex',
    alignItems: 'center',
    aspectRatio: '2/1',
    background: `url('/static/images/module_cards/${backgroundFile}.png'), url('/static/images/module_cards/for_kids.png')`,
    backgroundSize: 'contain',
    fontFamily: 'Handlee, sans-serif',
    color: '#221111',
    webkitTextStroke: node.forTeachers ? 'unset' : '1px white',
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
          style={buttonStyle}
          onClick={showVideo}>
          <MovieIcon sx={{ fontSize: '40px' }} />
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
      <VideoModal open={showModal}
        youtubeUrl={youtubeUrl}
        onDone={handleDoneVideo} />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Link to="#" onClick={showVideoOrMasteryIfDone}
            style={{ textDecoration: 'none' }}>
            <div style={innerStyle}>
              <h1>
                {node.title || node.id}
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
            <StarIcon sx={{ fontSize: '40px' }} />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export let List = () => {
  let student = useStudentContext();
  let [reached, setReached] = React.useState(new Set<string>(
    Object.entries(student.progress()).filter(
      ([k, v]) => v.status === ProgressStatus.PASSED
    ).map(([k, v]) => k)
  ));
  React.useCallback((newReached: Set<string>) => {
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
    return (
      <Card key={kmid} kmid={kmid} student={student} />
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <NavBar />
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
