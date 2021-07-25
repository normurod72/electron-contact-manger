import { Box, Stack, Typography } from '@material-ui/core';
import { Phone, Email, Home } from '@material-ui/icons';
import React from 'react';
import { ContactEdit } from '../data/schemas';

interface ContactDetailsItemProps {
  Icon: React.ElementType;
  label: string;
  value?: string;
}

function ContactDetailsItem({ Icon, label, value }: ContactDetailsItemProps) {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon color="action" fontSize="small" />
        <Typography variant="body1" color="GrayText" fontSize="20px">
          {label}
        </Typography>
      </Stack>

      <Box marginLeft="28px">
        <Typography variant="body1" fontSize="22px">
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export function ContactDetails({ contact }: { contact: ContactEdit }) {
  return (
    <Stack spacing={2}>
      <ContactDetailsItem Icon={Phone} label="Phone" value={contact.phone} />
      <ContactDetailsItem Icon={Email} label="Email" value={contact.email} />
      <ContactDetailsItem Icon={Home} label="Address" value={contact.address} />
    </Stack>
  );
}
