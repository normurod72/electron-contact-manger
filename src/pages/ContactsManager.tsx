import {
  Box,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  Fab,
  Skeleton,
} from '@material-ui/core';
import { Add, Edit, Search } from '@material-ui/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ContactDetails } from '../components/ContactDetails';
import {
  ContactAddDialog,
  ContactEditDialog,
} from '../components/ContactFormDialog';
import { listContacts } from '../data/contactsStorage';
import { ContactEdit } from '../data/schemas';
import { nameAvatar } from '../utils/common';
import { useAsync } from '../utils/hooks';

export default function ContactsManager() {
  const [dialogState, setDialogState] = useState<'add' | 'edit'>();
  const [selectedContact, setSelectedContact] = useState<ContactEdit>();
  const [searchKey, setSearchKey] = useState('');

  const { response, pending, execute } = useAsync(listContacts);

  const closeDialog = () => {
    setDialogState(undefined);
  };

  useEffect(() => {
    if (!!response && !selectedContact) {
      setSelectedContact(response[0]);
    }
  }, [response, selectedContact]);

  const filteredContacts = useMemo(
    () =>
      response?.filter((i) =>
        Object.values(i).some((x) =>
          x.toLowerCase().includes(searchKey.toLowerCase())
        )
      ),
    [searchKey, response]
  );

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
    >
      <ContactAddDialog
        open={dialogState === 'add'}
        onClose={closeDialog}
        onSuccess={(contact) => {
          setSelectedContact(contact);
          closeDialog();
          execute();
        }}
      />

      {!!selectedContact && (
        <ContactEditDialog
          contact={selectedContact}
          open={dialogState === 'edit'}
          onClose={closeDialog}
          onSuccess={(contact) => {
            setSelectedContact(contact);
            closeDialog();
            execute();
          }}
        />
      )}

      <Box
        display="flex"
        flexDirection="column"
        width="300px"
        height="100vh"
        flexShrink={0}
      >
        <Toolbar>
          <TextField
            placeholder="Search contacts"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>

        <Box flexGrow={1} overflow="auto">
          <List>
            {filteredContacts?.map((contact) => (
              <ListItem
                selected={selectedContact?.uuid === contact.uuid}
                button
                onClick={() => {
                  setSelectedContact(contact);
                }}
                key={contact.uuid}
              >
                <ListItemIcon>
                  <Avatar {...nameAvatar(contact.name)} />
                </ListItemIcon>
                <ListItemText
                  primary={contact.name}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
            {filteredContacts?.length === 0 && (
              <ListItem>
                <ListItemText
                  secondary={
                    <Typography color="GrayText" align="center">
                      No contacts
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>

        {pending && (
          <List>
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={i}>
                <ListItemIcon>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton />} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box flexGrow={1}>
        <Toolbar>
          <Stack direction="row" component={Box} width="100%">
            <Typography fontSize="24px" noWrap width="100%">
              {selectedContact?.name}
            </Typography>

            <Button
              disabled={!selectedContact}
              startIcon={<Edit />}
              onClick={() => {
                setDialogState('edit');
              }}
            >
              Edit
            </Button>
          </Stack>
        </Toolbar>
        <Divider />

        <Box p={3}>
          {!!selectedContact && <ContactDetails contact={selectedContact} />}
        </Box>
      </Box>

      <Box position="fixed" bottom={16} right={16}>
        <Fab
          variant="extended"
          size="large"
          color="primary"
          aria-label="add"
          onClick={() => {
            setDialogState('add');
          }}
        >
          <Add />
          Add Contact
        </Fab>
      </Box>
    </Stack>
  );
}
