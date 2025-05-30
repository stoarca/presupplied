import { PlayArrowOutlined } from '@mui/icons-material';
import { Button, Grid, Modal } from '@mui/material';
import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { KNOWLEDGE_MAP, ProgressVideoStatus, ModuleType, ProgressStatus, UserType, ChildInfoWithProgress } from '../../../common/types';
import { isModuleForAdults } from '../../../common/utils';
import { User } from '../UserContext';
import { LiveTv as MovieIcon } from '@mui/icons-material';
import { buildGraph } from '@src/dependency-graph';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { Avatar } from './Avatar';
import { UserSelector } from './UserSelector';
import { useErrorContext } from '../ErrorContext';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

let extractYouTubeId = (url: string): string | null => {
  let regExp =
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
    user: User;
    style?: CSSProperties;
    relevantChildren?: ChildInfoWithProgress[];
};

export let Card = ({ kmid, user, style, relevantChildren = [] }: CardProps) => {
  let node = React.useMemo(() => knowledgeGraph.getNodeData(kmid), [kmid]);
  let navigate = useNavigate();
  let [showModal, setShowModal] = React.useState(false);
  let [videoVanityId, setVideoVanityId] = React.useState('');
  let [youtubeUrl, setYoutubeUrl] = React.useState('');
  let [showChildSelector, setShowChildSelector] = React.useState(false);
  let [wasShiftClick, setWasShiftClick] = React.useState(false);
  const { showError } = useErrorContext();

  const relevantChildrenOptions = React.useMemo(() => {
    return relevantChildren.map(child => ({
      id: child.id,
      name: child.name,
      userType: UserType.STUDENT,
      profilePicture: child.profilePicture
    }));
  }, [relevantChildren]);
  let _showVideo = React.useCallback(async (masteryIfAllWatched: boolean) => {
    let videos = isModuleForAdults(node.moduleType) ? node.teacherVideos : node.studentVideos;
    let watchedVideos = await user.videos(kmid);
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
  }, [kmid, node, user, navigate]);
  let showVideo = React.useCallback(() => {
    return _showVideo(false);
  }, [_showVideo]);
  let showVideoOrMasteryIfDone = React.useCallback(async (e: React.MouseEvent) => {
    if (node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildren.length > 1) {
      setWasShiftClick(e.shiftKey);
      setShowChildSelector(true);
      return;
    }

    if (e.shiftKey) {
      e.preventDefault();

      try {
        const currentStatus = user.progress()[kmid]?.status || ProgressStatus.NOT_ATTEMPTED;
        const newStatus = currentStatus === ProgressStatus.PASSED ?
          ProgressStatus.NOT_ATTEMPTED : ProgressStatus.PASSED;

        if (user.dto && node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildren.length > 0) {
          await user.markReached({
            [kmid]: newStatus
          }, relevantChildren[0].id);
        } else {
          await user.markReached({
            [kmid]: newStatus
          });
        }

        await user.refreshUser();
      } catch (error) {
        console.error('Error marking progress:', error);
        showError({
          code: 'MARK_PROGRESS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to mark progress'
        });
      }
      return;
    }

    return _showVideo(true);
  }, [_showVideo, kmid, user, node.moduleType, relevantChildren, showError]);
  let handleDoneVideo = React.useCallback(async () => {
    await user.markWatched({
      [kmid]: {
        [videoVanityId]: ProgressVideoStatus.WATCHED,
      },
    });
    setShowModal(false);
  }, [kmid, user, videoVanityId]);

  let handleChildSelect = React.useCallback(async (childId: number) => {
    setShowChildSelector(false);

    if (wasShiftClick) {
      const currentStatus = user.progress()[kmid]?.status || ProgressStatus.NOT_ATTEMPTED;
      const newStatus = currentStatus === ProgressStatus.PASSED ?
        ProgressStatus.NOT_ATTEMPTED : ProgressStatus.PASSED;

      await user.markReached({
        [kmid]: newStatus
      }, childId);

      await user.refreshUser();
    } else {
      navigate(`/modules/${kmid}?childId=${childId}`);
    }
  }, [kmid, user, navigate, wasShiftClick]);
  const innerStyle: CSSProperties = {

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    aspectRatio: '3 / 2',
    background: 'linear-gradient(135deg, #bbfec4, #8af786)',
    backgroundSize: 'cover',
    fontFamily: 'Handlee, sans-serif',
    color: '#221111',
    textAlign: 'center',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '2px 2px 3px #00000033',
    position: 'relative', // TypeScript will now accept this
    width: '100%', // Ensure the card takes full width
    height: '100%', // Ensure the card takes full height
    ...style, // Apply the passed style
    marginBottom: '20px', // Ensure proper alignment
  };

  const cartoonStyle: CSSProperties = {
    height: '13rem',
    position: 'absolute',
    top: '62%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
  };

  const getCartoonImage = (title: string) => {
    // Simple hash function to get a consistent number from a string
    const hash = title.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    // Get a number between 1-7 using modulo
    const imageIndex = (hash % 7) + 1;
    return `/static/images/cartoon/cartoon${imageIndex}.png`;
  };

  let buttonStyle = {
    padding: '15px 30px',
    background: !isModuleForAdults(node.moduleType) ? 'linear-gradient(to right, #ffb300, #ffa000)' : 'linear-gradient(to right, rgba(255, 179, 0, 0.08), rgba(255, 162, 0, 0.15))',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#ffff66',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    fontFamily: '\'Rowdies\', serif',
    gap: '5px',
  };

  const buttonContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: '8%', // Move button slightly outside the box
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    display: 'flex', // Add flex display to align buttons
    gap: '10px', // Add gap between buttons
  };

  let videoButton;
  if (
    isModuleForAdults(node.moduleType) && node.teacherVideos.length ||
        !isModuleForAdults(node.moduleType) && node.studentVideos.length
  ) {
    videoButton = (
      <Grid item xs={6}>

        <Button variant="contained"
          color="success"
          style={buttonStyle}

          onClick={showVideo}>
                    Watch <MovieIcon sx={{ fontSize: '40px' }} />
        </Button>
      </Grid>
    );
  } else {
    videoButton = null; //eslint-disable-line
  }
  return (
    <Grid item
      key={kmid}
      xs={12} sm={8} md={6} lg={5} xl={4}
      style={{ width: '100%', height: '100%' }}> {/* Ensure the grid item takes full width and height */}
      <VideoModal open={showModal}
        youtubeUrl={youtubeUrl}
        onDone={handleDoneVideo} />

      {!isModuleForAdults(node.moduleType) && (
        <svg width="500" height="65" style={{ width: '100%' }} viewBox="0 0 887 106" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M567.505 20.9153L582.761 38.1555C589.979 46.3125 583.471 59.0922 572.629 58.0531L106.43 13.3709C94.6971 12.2464 89.12 27.442 98.7948 34.1745C108.637 41.0235 102.672 56.4756 90.7811 54.9355L0 43.1783V106H887V71.2308L579.151 1.26142C567.783 -1.32233 559.779 12.1848 567.505 20.9153Z" fill="#3AC634" />
        </svg>
      )}

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ padding: '0 !important' }}>
          <div
            data-test="module-card"
            onClick={showVideoOrMasteryIfDone}
            style={{
              ...innerStyle,
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
            <h1 style={{
              zIndex: 4,
              fontWeight: 400,
              fontFamily: '\'Archivo Black\', serif',
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              color: !isModuleForAdults(node.moduleType) ? '#164c29' : '#fff', // Dark green
              // textShadow: '0 0 2px #00ff99, 0 0 4px #000, 0 0 8px #00ff99',
            }}>{node.title || node.id}</h1>
            {node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildren.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
                zIndex: 4,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {relevantChildren.map(child => (
                  <div key={child.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Avatar
                      data-test={`child-avatar-${child.id}`}
                      userType={UserType.STUDENT}
                      profilePicture={child.profilePicture}
                      size={40}
                    />
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#164c29',
                    }}>{child.name}</span>
                  </div>
                ))}
              </div>
            )}
            {!isModuleForAdults(node.moduleType) && (
              <img src={getCartoonImage(node.title || node.id)} style={cartoonStyle} />
            )}
            <div style={buttonContainerStyle}>
              <Button variant="contained"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the parent onClick from firing
                  navigate(`/modules/${kmid}`);
                }}
                style={buttonStyle}
              >
                <PlayArrowOutlined sx={{ fontSize: '2rem' }} /> Play
              </Button>
              {/* {videoButton} */}
            </div>
          </div>
        </Grid>
      </Grid>

      {!isModuleForAdults(node.moduleType) && (
        <svg width="500" height="65" style={{ width: '100%' }} viewBox="0 0 887 106" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M567.505 85.0847L582.761 67.8445C589.979 59.6875 583.471 46.9078 572.629 47.9469L106.43 92.6291C94.6971 93.7536 89.12 78.558 98.7948 71.8255C108.637 64.9765 102.672 49.5244 90.7811 51.0645L0 62.8217V0H887V34.7692L579.151 104.739C567.783 107.322 559.779 93.8152 567.505 85.0847Z" fill="#ACFCBD" />
        </svg>
      )}

      <UserSelector
        open={showChildSelector}
        onClose={() => setShowChildSelector(false)}
        onSelect={handleChildSelect}
        title={wasShiftClick ? 'Which child would you like to mark progress for?' : 'Which child would you like to complete this module with?'}
        users={relevantChildrenOptions}
      />
    </Grid>
  );
};
