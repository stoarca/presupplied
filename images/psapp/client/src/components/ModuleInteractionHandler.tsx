import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressStatus, ModuleType, UserType, ChildInfoWithProgress, ProgressVideoStatus, VideoInfo, VideoProgressDTO } from '../../../common/types';
import { buildGraph } from '../dependency-graph';
import { KNOWLEDGE_MAP } from '../../../common/types';
import { User } from '../UserContext';
import { UserSelector } from './UserSelector';
import { ModuleChoiceScreen } from './ModuleChoiceScreen';
import { VideoListScreen } from './VideoListScreen';
import { useErrorContext } from '../ErrorContext';
import { Modal } from '@mui/material';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';

const knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

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
  if (!youtubeUrl) {
    return null;
  }
  let videoId = extractYouTubeId(youtubeUrl);

  let handleVideoStateChange = React.useCallback((event: YouTubeEvent) => {
    if (event.data === 0) {
      onDone();
    }
  }, [onDone]);

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

export const useModuleInteraction = (
  kmid: string,
  user: User,
  relevantChildrenSorted: ChildInfoWithProgress[] = []
) => {
  const navigate = useNavigate();
  const node = React.useMemo(() => knowledgeGraph.getNodeData(kmid), [kmid]);
  const [showChildSelector, setShowChildSelector] = React.useState(false);
  const [wasShiftClick, setWasShiftClick] = React.useState(false);
  const [showChoiceScreen, setShowChoiceScreen] = React.useState(false);
  const [showVideoList, setShowVideoList] = React.useState(false);
  const [videoListType, setVideoListType] = React.useState<'teacher' | 'student'>('student');
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState('');
  const [currentVideoId, setCurrentVideoId] = React.useState('');
  const [watchedVideos, setWatchedVideos] = React.useState<VideoProgressDTO>({});
  const { showError } = useErrorContext();


  const relevantChildrenOptions = React.useMemo(() => {
    return relevantChildrenSorted.map(child => ({
      id: child.id,
      name: child.name,
      userType: UserType.STUDENT,
      profilePicture: child.profilePicture
    }));
  }, [relevantChildrenSorted]);

  React.useEffect(() => {
    const loadWatchedVideos = async () => {
      try {
        const videos = await user.videos(kmid);
        setWatchedVideos(videos);
      } catch (error) {
        console.error('Error loading watched videos:', error);
      }
    };
    loadWatchedVideos();
  }, [kmid, user]);

  React.useEffect(() => {
    const handlePopstate = (event: PopStateEvent) => {
      if (showVideoModal) {
        // User pressed back while video was open
        setShowVideoModal(false);
        setCurrentVideoUrl('');
        setCurrentVideoId('');
        setShowVideoList(true);
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [showVideoModal]);

  const handleModuleClick = React.useCallback(async (e: React.MouseEvent) => {
    const isShiftClick = e.shiftKey;

    if (isShiftClick) {
      e.preventDefault();
      e.stopPropagation();
      setWasShiftClick(true);
    } else {
      setWasShiftClick(false);
    }

    const isStudent = user.dto?.type === UserType.STUDENT;
    const hasStudentVideos = node.studentVideos.length > 0;
    const hasTeacherVideos = node.teacherVideos.length > 0;
    const hasAnyVideos = hasStudentVideos || hasTeacherVideos;

    if (isStudent && hasStudentVideos) {
      setShowChoiceScreen(true);
    } else if (!isStudent && hasAnyVideos) {
      setShowChoiceScreen(true);
    } else if (node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 1) {
      setShowChildSelector(true);
    } else if (isShiftClick) {
      // For shift-click with no videos and no child selector needed, mark progress directly
      try {
        const currentStatus = user.progress()[kmid]?.status || ProgressStatus.NOT_ATTEMPTED;
        const newStatus = currentStatus === ProgressStatus.PASSED ?
          ProgressStatus.NOT_ATTEMPTED : ProgressStatus.PASSED;

        if (user.dto && node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 0) {
          await user.markReached({
            [kmid]: newStatus
          }, relevantChildrenSorted[0].id);
        } else {
          await user.markReached({
            [kmid]: newStatus
          });
        }
      } catch (error) {
        console.error('Error marking progress:', error);
        showError({
          code: 'MARK_PROGRESS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to mark progress'
        });
      }
    } else {
      navigate(`/modules/${kmid}`);
    }
  }, [kmid, user, node, navigate, relevantChildrenSorted, showError]);

  const handleTeachChoice = React.useCallback(() => {
    setShowChoiceScreen(false);
    setVideoListType('teacher');
    setShowVideoList(true);
  }, []);

  const handleLearnChoice = React.useCallback(() => {
    setShowChoiceScreen(false);
    setVideoListType('student');
    setShowVideoList(true);
  }, []);

  const handleMasteryChoice = React.useCallback(async () => {
    setShowChoiceScreen(false);

    if (node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 1) {
      setShowChildSelector(true);
    } else if (wasShiftClick) {
      try {
        const currentStatus = user.progress()[kmid]?.status || ProgressStatus.NOT_ATTEMPTED;
        const newStatus = currentStatus === ProgressStatus.PASSED ?
          ProgressStatus.NOT_ATTEMPTED : ProgressStatus.PASSED;

        if (user.dto && node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 0) {
          await user.markReached({
            [kmid]: newStatus
          }, relevantChildrenSorted[0].id);
        } else {
          await user.markReached({
            [kmid]: newStatus
          });
        }
      } catch (error) {
        showError({
          code: 'MARK_PROGRESS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to mark progress'
        });
      }
    } else if (node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 0) {
      navigate(`/modules/${kmid}?childId=${relevantChildrenSorted[0].id}`);
    } else {
      navigate(`/modules/${kmid}`);
    }
  }, [navigate, kmid, wasShiftClick, user, node.moduleType, relevantChildrenSorted, showError]);

  const handleChildSelect = React.useCallback(async (childId: number) => {
    setShowChildSelector(false);

    if (wasShiftClick) {
      const currentStatus = user.progress()[kmid]?.status || ProgressStatus.NOT_ATTEMPTED;
      const newStatus = currentStatus === ProgressStatus.PASSED ?
        ProgressStatus.NOT_ATTEMPTED : ProgressStatus.PASSED;

      await user.markReached({
        [kmid]: newStatus
      }, childId);
    } else {
      navigate(`/modules/${kmid}?childId=${childId}`);
    }
  }, [kmid, user, navigate, wasShiftClick]);

  const handleVideoSelect = React.useCallback(async (video: VideoInfo) => {
    if (wasShiftClick) {
      await user.markWatched({
        [kmid]: {
          [video.id]: ProgressVideoStatus.WATCHED,
        },
      });
    } else {
      // Push a history entry for the video
      window.history.pushState({ videoModal: true, videoId: video.id }, '', '');

      setShowVideoList(false);
      setCurrentVideoUrl(video.url);
      setCurrentVideoId(video.id);
      setShowVideoModal(true);
    }
  }, [wasShiftClick, kmid, user]);

  const handleVideoDone = React.useCallback(async () => {
    await user.markWatched({
      [kmid]: {
        [currentVideoId]: ProgressVideoStatus.WATCHED,
      },
    });

    // Go back in history to return to video list
    window.history.back();
  }, [kmid, user, currentVideoId]);

  const ModuleInteractionComponents = (
    <>
      <UserSelector
        open={showChildSelector}
        onClose={() => setShowChildSelector(false)}
        onSelect={handleChildSelect}
        title={wasShiftClick ? 'Which child would you like to mark progress for?' : 'Which child would you like to complete this module with?'}
        users={relevantChildrenOptions}
        wasShiftClick={wasShiftClick}
      />

      <ModuleChoiceScreen
        open={showChoiceScreen}
        onClose={() => setShowChoiceScreen(false)}
        moduleTitle={node.title || node.id}
        moduleType={node.moduleType}
        user={user}
        teacherVideos={node.teacherVideos}
        studentVideos={node.studentVideos}
        watchedVideos={watchedVideos}
        onTeachChoice={handleTeachChoice}
        onLearnChoice={handleLearnChoice}
        onMasteryChoice={handleMasteryChoice}
        wasShiftClick={wasShiftClick}
      />

      <VideoListScreen
        open={showVideoList}
        onClose={() => {
          setShowVideoList(false);
          setShowChoiceScreen(true);
        }}
        title={node.title || node.id}
        description={videoListType === 'teacher'
          ? 'Watch these videos to learn how to guide your child through this module'
          : 'Watch these videos to learn about this topic'
        }
        videos={videoListType === 'teacher' ? node.teacherVideos : node.studentVideos}
        watchedVideos={watchedVideos}
        onVideoSelect={handleVideoSelect}
        wasShiftClick={wasShiftClick}
      />

      <VideoModal
        open={showVideoModal}
        youtubeUrl={currentVideoUrl}
        onDone={handleVideoDone}
      />
    </>
  );

  return {
    handleModuleClick,
    ModuleInteractionComponents
  };
};
