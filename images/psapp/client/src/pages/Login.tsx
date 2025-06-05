import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LockOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Card } from '../components/Card';
import { NavBar } from '../components/NavBar';
import { Logo } from '../components/Logo';

import {typedFetch, API_HOST} from '../typedFetch';
import { useUserContext } from '../UserContext';

interface LoginProps {
  [K: string]: never
};

type E = React.FormEvent<HTMLFormElement>;

export let Login = (props: LoginProps) => {
  let user = useUserContext();
  let [loading, setLoading] = React.useState(false);
  let [fields, setFields] = React.useState({
    email: {error: false, helperText: ''},
    password: {error: false, helperText: ''},
  });


  const handleSubmit = React.useCallback(async (event: E) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setFields({
      email: {error: false, helperText: ''},
      password: {error: false, helperText: ''},
    });

    const data = new FormData(event.currentTarget);
    try {
      let resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/auth/login',
        method: 'post',
        body: {
          email: data.get('email') as string,
          password: data.get('password') as string,
        },
      });
      if ('success' in resp) {
        window.location.href = '/';
        return;
      }
      if (resp.errorCode === 'auth.login.email.nonexistent') {
        let narrow = resp;
        setFields(fields => ({
          ...fields,
          email: {error: true, helperText: narrow.message}
        }));
      } else if (
        resp.errorCode === 'auth.login.password.invalid' ||
        resp.errorCode === 'auth.login.password.notset'
      ) {
        let narrow = resp;
        setFields(fields => ({
          ...fields,
          password: {error: true, helperText: narrow.message}
        }));
      } else {
        let check: never = resp; // eslint-disable-line no-unused-vars
      }
    } finally {
      setLoading(false);
    }
  }, [loading, user]);

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
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
                error={fields.password.error}
                helperText={fields.password.helperText}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2" component="span">
                    Don't have an account?{' '}
                  </Typography>
                  <Link component={RouterLink} to="/register" variant="body2">
                    Register
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
