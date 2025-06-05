import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Star as StarIcon,
  School as DiplomaIcon,
} from '@mui/icons-material';
import { VideoInfo, UserType, ModuleType, ProgressVideoStatus, VideoProgressDTO } from '../../../common/types';
import { User } from '../UserContext';

interface ModuleChoiceScreenProps {
  open: boolean;
  onClose: () => void;
  moduleTitle: string;
  moduleType: ModuleType;
  user: User;
  teacherVideos: VideoInfo[];
  studentVideos: VideoInfo[];
  watchedVideos: VideoProgressDTO;
  onTeachChoice: () => void;
  onLearnChoice: () => void;
  onMasteryChoice: () => void;
  wasShiftClick?: boolean;
}

export const ModuleChoiceScreen = ({
  open,
  onClose,
  moduleTitle,
  moduleType,
  user,
  teacherVideos,
  studentVideos,
  watchedVideos,
  onTeachChoice,
  onLearnChoice,
  onMasteryChoice,
  wasShiftClick = false,
}: ModuleChoiceScreenProps) => {
  const userType = user.dto?.type || UserType.STUDENT;
  const isAdult = userType === UserType.PARENT || userType === UserType.TEACHER;
  const isStudent = userType === UserType.STUDENT;
  const isChildDelegated = moduleType === ModuleType.CHILD_DELEGATED;
  const isHybridUser = user.isSelfManaged() && !isAdult;

  const getUnwatchedVideosInfo = (videos: VideoInfo[]) => {
    const unwatched = videos.filter(video =>
      watchedVideos[video.id]?.status !== ProgressVideoStatus.WATCHED
    );
    return {
      count: unwatched.length,
      total: videos.length,
    };
  };

  const teacherVideosInfo = getUnwatchedVideosInfo(teacherVideos);
  const studentVideosInfo = getUnwatchedVideosInfo(studentVideos);

  const shouldShowTeachOption = ((isAdult && isChildDelegated) || isHybridUser) && teacherVideos.length > 0;
  const shouldShowLearnOption = (isStudent || (isAdult && isChildDelegated) || isHybridUser) && studentVideos.length > 0;

  const showChoiceScreen = shouldShowTeachOption || shouldShowLearnOption;

  if (!showChoiceScreen) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      data-test="module-choice-dialog"
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="h6" component="div">
            {moduleTitle}
          </Typography>
          {wasShiftClick && (
            <Chip
              label="Forcing completion"
              size="small"
              color="error"
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 275, maxWidth: 600, mx: 'auto' }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            my: 4
          }}>
            {shouldShowTeachOption && (
              <Box
                onClick={onTeachChoice}
                data-test="teach-choice"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: 2,
                  minWidth: 140,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1
                }}>
                  <DiplomaIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                >
                  How to teach
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Learn how to guide your child
                </Typography>
                <Chip
                  label={teacherVideosInfo.count > 0 ? `${teacherVideosInfo.count} unwatched` : 'All videos watched'}
                  size="small"
                  color={teacherVideosInfo.count > 0 ? 'error' : 'success'}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}

            {shouldShowLearnOption && (
              <Box
                onClick={onLearnChoice}
                data-test="learn-choice"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: 2,
                  minWidth: 140,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1
                }}>
                  <PlayIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                >
                  Learn
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {isStudent ? 'Watch videos to learn' : 'Watch with your child'}
                </Typography>
                <Chip
                  label={studentVideosInfo.count > 0 ? `${studentVideosInfo.count} unwatched` : 'All videos watched'}
                  size="small"
                  color={studentVideosInfo.count > 0 ? 'error' : 'success'}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}

            <Box
              onClick={onMasteryChoice}
              data-test="mastery-choice"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                padding: 2,
                minWidth: 140,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}>
                <StarIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                align="center"
                sx={{ mt: 1, fontWeight: 'bold' }}
              >
                Prove mastery
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {isStudent ? 'Demonstrate understanding' : 'Complete the module'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};