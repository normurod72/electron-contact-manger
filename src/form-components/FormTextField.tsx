import { StandardTextFieldProps, TextField } from '@material-ui/core';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface FormTextFieldProps extends StandardTextFieldProps {
  name: string;
}
export default function FormTextField({
  name,
  disabled,
  helperText,
  ...textFieldProps
}: FormTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      render={({
        field: { ref, value, onChange },
        fieldState: { invalid, error },
      }) => {
        return (
          <TextField
            inputRef={ref}
            error={invalid}
            helperText={error?.message || helperText}
            value={value}
            onChange={onChange}
            {...textFieldProps}
          />
        );
      }}
      name={name}
      control={control}
    />
  );
}
