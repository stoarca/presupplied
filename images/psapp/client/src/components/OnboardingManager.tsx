import React, { useState, useEffect } from 'react';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';
import { ChildCreator } from './ChildCreator';
import { NavBar } from './NavBar';

interface OnboardingManagerProps {
  children: React.ReactNode;
}

export const OnboardingManager = ({ children }: OnboardingManagerProps) => {
  const [loading, setLoading] = useState(true);
  const [showChildCreator, setShowChildCreator] = useState(false);
  const user = useUserContext();

  useEffect(() => {
    // Only check for parent/teacher users who are logged in
    if (user.dto && (user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER)) {
      // Check if the user has any children directly from the user DTO
      if (!user.dto.children || user.dto.children.length === 0) {
        setShowChildCreator(true);
      }
    }
    setLoading(false);
  }, [user.dto]);

  const handleChildCreationComplete = () => {
    setShowChildCreator(false);
    // Reload the page to refresh user DTO and show the new child
    window.location.reload();
  };

  // If we're checking onboarding status, don't render anything yet
  if (loading) {
    return null;
  }

  if (showChildCreator) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <NavBar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
        }}>
          <ChildCreator onComplete={handleChildCreationComplete} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};