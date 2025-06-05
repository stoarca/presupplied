import React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LockOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { Card } from '../components/Card';
import { NavBar } from '../components/NavBar';
import { Logo } from '../components/Logo';

import {typedFetch, API_HOST} from '../typedFetch';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';

interface RegisterProps {
  [K: string]: never
};

type E = React.FormEvent<HTMLFormElement>;

export let Register = (props: RegisterProps) => {
  let user = useUserContext();

  let [loading, setLoading] = React.useState(false);
  let [userType, setUserType] = React.useState<UserType>(UserType.STUDENT);
  let [fields, setFields] = React.useState({
    email: {error: false, helperText: ''},
  });

  const handleUserTypeChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value as UserType);
  }, []);

  const handleSubmit = React.useCallback(async (event: E) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setFields({
      email: {error: false, helperText: ''},
    });

    const data = new FormData(event.currentTarget);
    try {
      const email = data.get('email') as string;
      const name = data.get('name') as string;
      const password = data.get('password') as string;
      let resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/auth/register',
        method: 'post',
        body: {
          name,
          email,
          password,
          type: userType,
        },
      });
      if ('success' in resp) {
        window.location.href = '/';
        return;
      }
      if (
        resp.errorCode === 'auth.register.email.invalid' ||
        resp.errorCode === 'auth.register.email.alreadyRegistered'
      ) {
        let narrow = resp; // to narrow the type for the callback
        setFields(fields => ({
          ...fields,
          email: {error: true, helperText: narrow.message}
        }));
      } else {
        let check: never = resp;  // eslint-disable-line no-unused-vars
      }
    } finally {
      setLoading(false);
    }
  }, [loading, user, userType]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
        <NavBar />
      </Box>
      <Container component="main" maxWidth="xs">
        <Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'text.primary' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ color: 'text.primary', mb: 3 }}>
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                <FormLabel component="legend">I am registering as a:</FormLabel>
                <RadioGroup
                  row
                  aria-label="user type"
                  name="user-type"
                  value={userType}
                  onChange={handleUserTypeChange}
                >
                  <FormControlLabel
                    value={UserType.STUDENT}
                    control={<Radio />}
                    label="Student"
                  />
                  <FormControlLabel
                    value={UserType.PARENT}
                    control={<Radio />}
                    label="Parent"
                  />
                  <FormControlLabel
                    value={UserType.TEACHER}
                    control={<Radio />}
                    label="Teacher"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={fields.email.error}
                helperText={fields.email.helperText}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />

              {userType !== UserType.STUDENT && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  After registration, you'll be able to add children that you manage.
                </Typography>
              )}

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                loading={loading}
                loadingIndicator="Registering..."
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </LoadingButton>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2" component="span">
                    Already have an account?{' '}
                  </Typography>
                  <Link component={RouterLink} to="/login" variant="body2" data-test="login-link-register">
                    Log in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Card>
      </Container>
      <Logo />
    </div>
  );
};
