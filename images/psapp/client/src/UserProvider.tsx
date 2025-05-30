import React, { useState, useMemo } from 'react';
import { User, UserContext } from './UserContext';
import { UserDTO } from '../../common/types';

interface UserProviderProps {
  initialUser: User;
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ initialUser, children }) => {
  const [userDto, setUserDto] = useState<UserDTO | null>(initialUser.dto);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const user = useMemo(() => {
    const userInstance = new User(userDto);
    userInstance.onUpdate = (dto) => {
      setUserDto(dto);
      // Force re-render for anonymous users
      if (!dto) {
        setUpdateTrigger(prev => prev + 1);
      }
    };
    return userInstance;
  }, [userDto, updateTrigger]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
