import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {typedFetch, API_HOST} from './typedFetch';
import { useStudentContext } from './StudentContext';

interface LoginProps {
  [K: string]: never
};

type E = React.FormEvent<HTMLFormElement>;

export let Login = (props: LoginProps) => {
  let student = useStudentContext();
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
        await student.mergeToServer();
        window.location.href = '/';
        return;
      }
      if (resp.errorCode === 'auth.login.email.nonexistent') {
        let narrow = resp;
        setFields(fields => ({
          ...fields,
          email: {error: true, helperText: narrow.message}
        }));
      } else if (resp.errorCode === 'auth.login.password.invalid') {
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
  }, [loading]);

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
