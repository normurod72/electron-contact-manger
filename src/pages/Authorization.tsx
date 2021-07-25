import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import React, { forwardRef, useMemo, useState } from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useAuthContext } from '../data/AuthContext';

const PasswordField = forwardRef(
  (
    { InputProps, ...props }: TextFieldProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <TextField
        {...props}
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => {
                  setIsVisible(!isVisible);
                }}
              >
                {isVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
);
PasswordField.displayName = 'PasswordField';

const schema = object({
  password: string().required('Enter a password'),
});

export default function Authorization() {
  const [error, setError] = useState('');
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
    },
  });

  const { login } = useAuthContext();

  const onSubmit = ({ password }: { password: string }) => {
    if (!login(password)) {
      setError('Password did not match');
    }
  };

  const { register } = form;
  const { ref, ...rest } = useMemo(() => register('password'), [register]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Card>
        <Box maxWidth="400px" textAlign="center" p={4}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography variant="h5" gutterBottom>
                Welcome to Simple Secure Contact Manager
              </Typography>

              <Typography variant="h5">
                Please enter the password for your contact data file.
              </Typography>

              {!!error && <Alert severity="error">{error}</Alert>}

              <PasswordField
                inputRef={ref}
                fullWidth
                error={!!form.formState.errors.password?.message}
                helperText={form.formState.errors.password?.message}
                {...rest}
              />

              <Stack spacing={2} direction="row">
                <Button
                  fullWidth
                  color="secondary"
                  onClick={() => {
                    window.close();
                  }}
                >
                  Close
                </Button>
                <Button fullWidth type="submit">
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Card>
    </Box>
  );
}
