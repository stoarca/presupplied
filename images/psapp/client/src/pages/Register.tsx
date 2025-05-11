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

import {typedFetch, API_HOST} from '../typedFetch';
import { useStudentContext } from '../StudentContext';

interface RegisterProps {
  [K: string]: never
};

type E = React.FormEvent<HTMLFormElement>;

export let Register = (props: RegisterProps) => {
  let student = useStudentContext();
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
        // Sync local progress with the server
        await student.mergeToServer();
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
  }, [loading, student]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              <Link component={RouterLink} to="/login" variant="body2">
                {'Already have an account? Sign in'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
