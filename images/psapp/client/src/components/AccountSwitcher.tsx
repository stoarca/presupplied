import React, { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { UserType, RelationshipType, ProfilePicture } from '../../../common/types';
import { UserSelector, UserOption } from './UserSelector';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface RelatedAccount {
  id: number;
  name: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  pinRequired: boolean;
  relationshipType: RelationshipType;
  isSelected: false;
}

interface CurrentUserAccount {
  id: number;
  name: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  pinRequired: false;
  relationshipType: RelationshipType;
  isSelected: true;
}

type Account = RelatedAccount | CurrentUserAccount;

interface AccountSwitcherProps {
  open: boolean;
  onClose: () => void;
}

export const AccountSwitcher = (props: AccountSwitcherProps) => {
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<RelatedAccount | null>(null);
  const [relationships, setRelationships] = useState<{
    children?: RelatedAccount[],
    adults?: RelatedAccount[],
    classmates?: RelatedAccount[]
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const user = useUserContext();

  const switchAccount = useCallback(async (userId: number, credential?: string) => {
    try {
      const body = {
        targetId: userId.toString(),
        ...(usePassword ? { password: credential } : { pin: credential })
      };

      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/auth/switch',
        method: 'post',
        body
      });

      if ('success' in response && response.success) {
        window.location.href = '/';
      } else if ('errorCode' in response) {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error switching account:', error);
      setError('Failed to switch account');
    }
  }, [setError, usePassword]);

  const handleClose = () => {
    props.onClose();
  };

  const handleAccountSelect = async (account: Account) => {
    if (account.isSelected) {
      return;
    }

    const needsPin = account.pinRequired ||
      account.type === UserType.PARENT ||
      account.type === UserType.TEACHER;

    if (needsPin) {
      setSelectedAccount(account);
      setPinError(null);
      setPinDialogOpen(true);
    } else {
      await switchAccount(account.id);
    }
  };

  const handlePinSubmit = useCallback(async () => {
    if (selectedAccount) {
      const credential = usePassword ? password : pin;
      if (credential) {
        setPinError(null);
        try {
          const body = {
            targetId: selectedAccount.id.toString(),
            ...(usePassword ? { password: credential } : { pin: credential })
          };

          const response = await typedFetch({
            host: API_HOST,
            endpoint: '/api/auth/switch',
            method: 'post',
            body
          });

          if ('success' in response && response.success) {
            setPinDialogOpen(false);
            setTimeout(() => {
              // HACK: if these are set immediately then there will be a UI
              // flash because the layout will move
              setPin('');
              setPassword('');
              setUsePassword(false);
              setSelectedAccount(null);
              setPinError(null);
            }, 300);
            window.location.href = '/';
          } else if ('errorCode' in response) {
            setPinError(response.message);
          }
        } catch (error) {
          console.error('Error switching account:', error);
          setPinError('Failed to switch account');
        }
      }
    }
  }, [selectedAccount, pin, password, usePassword]);

  const handlePinDialogClose = () => {
    setPinDialogOpen(false);
    setTimeout(() => {
      // HACK: if these are set immediately then there will be a UI
      // flash because the layout will move
      setPin('');
      setPassword('');
      setUsePassword(false);
      setPinError(null);
      setSelectedAccount(null);
    }, 300);
  };

  useEffect(() => {
    if (props.open && user.dto) {
      const updatedRelationships: {
        children?: RelatedAccount[],
        adults?: RelatedAccount[],
        classmates?: RelatedAccount[]
      } = {};

      if ((user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER) && user.dto.children) {
        updatedRelationships.children = user.dto.children.map(child => ({
          id: child.id,
          name: child.name,
          type: UserType.STUDENT,
          profilePicture: child.profilePicture,
          relationshipType: RelationshipType.PRIMARY,
          pinRequired: child.pinRequired || false,
          isSelected: false as const
        }));
      }

      if (user.dto.type === UserType.STUDENT && user.dto.adults) {
        updatedRelationships.adults = user.dto.adults
            .filter(adult => adult.loggedIn)
            .map(adult => ({
              id: adult.id,
              name: adult.name,
              type: adult.type,
              profilePicture: adult.profilePicture,
              relationshipType: adult.relationshipType,
              pinRequired: true,
              isSelected: false as const
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
      }

      if (user.dto.type === UserType.STUDENT && user.dto.classmates) {
        updatedRelationships.classmates = user.dto.classmates.map(classmate => ({
          id: classmate.id,
          name: classmate.name,
          type: UserType.STUDENT,
          profilePicture: classmate.profilePicture,
          relationshipType: RelationshipType.PRIMARY,
          pinRequired: classmate.pinRequired || false,
          isSelected: false as const
        })).sort((a, b) => a.name.localeCompare(b.name));
      }

      setRelationships(updatedRelationships);
      setError(null);
    }
  }, [props.open, user.dto]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (pinDialogOpen && !usePassword) {
        if (e.key === 'Enter' && pin) {
          handlePinSubmit();
          return;
        }

        if (e.key === 'Backspace') {
          setPin(prev => prev.slice(0, -1));
          return;
        }

        const digit = /^[0-9]$/.test(e.key) ? e.key : null;
        if (digit && pin.length < 6) {
          setPin(prev => prev + digit);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [pinDialogOpen, pin, usePassword, handlePinSubmit]);

  useEffect(() => {
    if (pinDialogOpen && usePassword) {
      setTimeout(() => {
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 50);
    }
  }, [pinDialogOpen, usePassword]);

  if (!user.dto) {
    return null;
  }

  const currentUserAccount: Account = {
    id: user.dto?.id || 0,
    name: user.dto?.name || '',
    type: user.dto?.type || UserType.STUDENT,
    profilePicture: user.dto?.profilePicture,
    relationshipType: RelationshipType.PRIMARY,
    pinRequired: false,
    isSelected: true,
  };

  let allAccounts: Account[];

  if (user.dto?.type === UserType.PARENT || user.dto?.type === UserType.TEACHER) {
    allAccounts = [
      currentUserAccount,
      ...(relationships.children || []),
    ];
  } else {
    const adults = relationships.adults || [];
    const nonAdults = [
      currentUserAccount,
      ...(relationships.classmates || []),
    ].sort((a, b) => a.name.localeCompare(b.name));

    allAccounts = [
      ...adults,
      ...nonAdults,
    ];
  }

  const userOptions: UserOption[] = allAccounts.map(account => ({
    id: account.id,
    name: account.name,
    userType: account.type,
    profilePicture: account.profilePicture,
    isSelected: account.isSelected,
    caption: account.type === UserType.STUDENT && account.pinRequired ? 'PIN required' : undefined,
    subtitle: (account.type === UserType.PARENT || account.type === UserType.TEACHER)
      ? (account.type === UserType.TEACHER ? 'Teacher' : 'Parent')
      : undefined
  }));

  const handleUserSelect = (userId: number) => {
    const account = allAccounts.find(a => a.id === userId);
    if (account) {
      handleAccountSelect(account);
    }
  };

  return (
    <>
      {error && (
        <Dialog open={props.open && !!error} onClose={() => setError(null)}>
          <DialogContent>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setError(null)}>OK</Button>
          </DialogActions>
        </Dialog>
      )}

      <UserSelector
        open={props.open && !error}
        onClose={handleClose}
        onSelect={handleUserSelect}
        title="Switch Account"
        users={userOptions}
      />

      <Dialog open={pinDialogOpen} onClose={handlePinDialogClose} data-test="pin-dialog">
        <DialogTitle>{usePassword ? 'Enter Password' : 'Enter PIN'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {usePassword
              ? `Please enter your password to switch to ${selectedAccount?.name}'s account:`
              : `Please enter the PIN for ${selectedAccount?.name}'s account:`
            }
          </DialogContentText>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 2
            }}
          >
            {usePassword ? (
              <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && password) {
                    handlePinSubmit();
                  }
                }}
                sx={{ mb: 2, width: '100%' }}
                autoFocus
                data-test="pin-dialog-password-input"
              />
            ) : (
              <TextField
                margin="dense"
                id="pin"
                label="PIN"
                type="password"
                variant="outlined"
                value={pin}
                helperText={selectedAccount && (selectedAccount.type === UserType.PARENT || selectedAccount.type === UserType.TEACHER) ? 'Default PIN: 4000' : ''}
                inputProps={{
                  maxLength: 6,
                  inputMode: 'none',
                  readOnly: true,
                  'aria-label': 'PIN code entry field'
                }}
                sx={{ mb: 2, width: '100%' }}
                InputProps={{
                  sx: {
                    letterSpacing: '8px',
                    textAlign: 'center'
                  }
                }}
              />
            )}

            {!usePassword && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  width: '100%',
                  maxWidth: 300
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    variant="outlined"
                    data-test={`pin-digit-${num}`}
                    onClick={() => setPin(prev => prev.length < 6 ? prev + num : prev)}
                    sx={{
                      minWidth: 60,
                      height: 60,
                      fontSize: '1.5rem'
                    }}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setPin(prev => prev.slice(0, -1))}
                  data-test="pin-backspace"
                  sx={{
                    minWidth: 60,
                    height: 60,
                    fontSize: '1.2rem',
                    gridColumn: '1 / 2'
                  }}
                >
                  ←
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setPin(prev => prev.length < 6 ? prev + '0' : prev)}
                  data-test="pin-digit-0"
                  sx={{
                    minWidth: 60,
                    height: 60,
                    fontSize: '1.5rem',
                    gridColumn: '2 / 3'
                  }}
                >
                  0
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePinSubmit}
                  disabled={!pin}
                  data-test="pin-submit"
                  sx={{
                    minWidth: 60,
                    height: 60,
                    fontSize: '1.2rem',
                    gridColumn: '3 / 4'
                  }}
                >
                  ✓
                </Button>
              </Box>
            )}

            {usePassword && (
              <Button
                variant="contained"
                onClick={handlePinSubmit}
                disabled={!password}
                fullWidth
                sx={{ mt: 1 }}
                data-test="pin-dialog-password-submit"
              >
                Submit
              </Button>
            )}

            {selectedAccount && (selectedAccount.type === UserType.PARENT || selectedAccount.type === UserType.TEACHER) && (
              <Button
                variant="text"
                onClick={() => {
                  setUsePassword(!usePassword);
                  setPin('');
                  setPassword('');
                  setPinError(null);
                }}
                sx={{ mt: 2, textTransform: 'none', color: 'text.secondary' }}
                data-test="switch-auth-method"
              >
                {usePassword ? 'Use PIN instead' : 'Use password instead'}
              </Button>
            )}

            {pinError && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }} data-test="pin-error">
                {pinError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePinDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
