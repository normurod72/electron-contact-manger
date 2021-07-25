import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  IconButton,
  DialogContent,
  Box,
  Button,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Contact, ContactEdit, contactSchema } from '../data/schemas';
import FormTextField from '../form-components/FormTextField';
import { addContact, editContact } from '../data/contactsStorage';

interface ContactFormFieldsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

function ContactFormFields({ isSubmitting, onClose }: ContactFormFieldsProps) {
  return (
    <Box width="360px" paddingTop={0.5}>
      <Stack spacing={2} alignItems="flex-end">
        <FormTextField name="name" label="Name" fullWidth />
        <FormTextField name="phone" label="Phone" fullWidth />
        <FormTextField name="email" label="Email" fullWidth />
        <FormTextField
          name="address"
          label="Address"
          fullWidth
          multiline
          rows={3}
        />

        <Stack direction="row" spacing={2}>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            disableElevation
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (contact: ContactEdit) => void;
}

export function ContactAddDialog({
  open,
  onClose,
  onSuccess,
}: ContactFormDialogProps) {
  const form = useForm<Contact>({
    mode: 'onBlur',
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const onSubmit = (values: Contact) => {
    return addContact(values).then((data) => {
      form.reset();
      onSuccess(data);
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Typography variant="inherit" width="100%">
            Add Contact
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ContactFormFields
              isSubmitting={form.formState.isSubmitting}
              onClose={onClose}
            />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

interface ContactEditDialogProps {
  open: boolean;
  contact: ContactEdit;
  onClose: () => void;
  onSuccess: (contact: ContactEdit) => void;
}

export function ContactEditDialog({
  open,
  contact,
  onClose,
  onSuccess,
}: ContactEditDialogProps) {
  const form = useForm<ContactEdit>({
    resolver: yupResolver(contactSchema),
  });

  const { reset } = form;

  useEffect(() => {
    reset(contact);
  }, [contact, reset]);

  const onSubmit = (values: ContactEdit) => {
    const withUUID = { ...values, uuid: contact.uuid };
    return editContact(withUUID).then(() => {
      form.reset();
      onSuccess(withUUID);
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Typography variant="inherit" width="100%">
            Edit Contact
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ContactFormFields
              isSubmitting={form.formState.isSubmitting}
              onClose={onClose}
            />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
