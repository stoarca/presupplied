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
    if (user.dto && (user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER)) {
      if (user.dto.pendingInvites.length > 0) {
        if (location.pathname !== '/invitations') {
          navigate('/invitations', { replace: true });
          return;
        }
      } else if (!user.dto.children || user.dto.children.length === 0) {
        if (location.pathname !== '/create-child') {
          navigate('/create-child', { replace: true });
          return;
        }
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