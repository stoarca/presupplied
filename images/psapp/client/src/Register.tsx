import React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

interface RegisterProps {
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
      let resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password'),
        }),
      });
      let json = await resp.json();
      if (resp.ok) {
        // redirect to somewhere useful
        return;
      }
      if (json.errorCode.startsWith('auth.register.email.')) {
        setFields(fields => ({
          ...fields,
          email: {error: true, helperText: json.message}
        }));
      } else {
        throw new Error(json);
      }
    } catch (e) {
      throw e;
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
        </Box>
      </Box>
    </Container>
  );
}
