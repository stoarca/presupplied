import React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from '@mui/material';

import {typedFetch, API_HOST} from '../typedFetch';

interface RegisterProps {
  [K: string]: never
};

type E = React.FormEvent<HTMLFormElement>;

export let Register = (props: RegisterProps) => {
  let [loading, setLoading] = React.useState(false);
  let [fields, setFields] = React.useState({
    email: {error: false, helperText: ''},
  });

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
      let resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/auth/register',
        method: 'post',
        body: {
          name: data.get('name') as string,
          email: data.get('email') as string,
          password: data.get('password') as string,
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
  }, [loading]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#2e7d32', width: 56, height: 56 }}>
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ color: '#1b5e20', fontWeight: 600, mb: 3 }}>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
              },
            }}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            loadingIndicator="Registering..."
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#2e7d32',
              height: 48,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: '#1b5e20',
              },
            }}
          >
            Register
          </LoadingButton>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" display="inline">
              Already have an account? {' '}
            </Typography>
            <Link
              href="/login"
              variant="body2"
              sx={{
                color: '#2e7d32',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#1b5e20'
                }
              }}
            >
              Sign in here
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
