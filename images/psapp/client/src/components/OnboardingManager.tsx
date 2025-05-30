import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';

interface OnboardingManagerProps {
  children: React.ReactNode;
}

export const OnboardingManager = ({ children }: OnboardingManagerProps) => {
  const [loading, setLoading] = useState(true);
  const user = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user.dto) {
      if (user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER) {
        if (user.dto.pendingInvites.length > 0) {
          if (location.pathname !== '/invitations') {
            navigate('/invitations', { replace: true });
          } else {
            setLoading(false);
          }
          return;
        } else if (!user.dto.children || user.dto.children.length === 0) {
          if (location.pathname !== '/create-child') {
            navigate('/create-child', { replace: true });
          } else {
            setLoading(false);
          }
          return;
        }
      }

      if (user.hasLocalProgress()) {
        if (location.pathname !== '/sync-progress' && location.pathname !== '/create-child') {
          navigate('/sync-progress', { replace: true });
        } else {
          setLoading(false);
        }
        return;
      }
    }
    setLoading(false);
  }, [user.dto, navigate, location.pathname]);

  // If we're checking onboarding status, don't render anything yet
  if (loading) {
    return null;
  }

  return <>{children}</>;
};
