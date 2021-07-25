import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import { Contact, ContactEdit } from './schemas';
import { decrypt, encrypt } from '../utils/crypto';

const FILE_PATH = './secure_data.txt';

function encryptContact({ name, phone, email, address }: Contact) {
  return encrypt([name, phone, email, address].join(','));
}

function decryptContact(values: string, iv: string): Contact {
  const [name, phone, email, address] = decrypt(values, iv).split(',');
  return { name, phone, email, address };
}

function parseEncryptedContacts(data: string): ContactEdit[] {
  return data
    .split('\n')
    .filter((row) => {
      const [uuid, contactEncrypted, iv] = row.split(',');
      return !!uuid && !!contactEncrypted && !!iv;
    })
    .map((row) => {
      const [uuid, contactEncrypted, iv] = row.split(',');
      return {
        uuid,
        ...decryptContact(contactEncrypted, iv),
      };
    });
}

export async function addContact(contact: Contact) {
  const { content, iv } = encryptContact(contact);
  const uuid = uuidv4();
  const valuesToStore = `\n${uuid},${content},${iv}`;
  const exist = await fs.pathExists(FILE_PATH);

  if (exist) {
    return fs.appendFile(FILE_PATH, valuesToStore).then(() => ({
      uuid,
      ...contact,
    }));
  }
  return fs.outputFile(FILE_PATH, valuesToStore).then(() => ({
    uuid,
    ...contact,
  }));
}

export async function editContact({ uuid, ...contact }: ContactEdit) {
  const { content, iv } = encryptContact(contact);
  const exist = await fs.pathExists(FILE_PATH);

  if (exist) {
    return fs.readFile(FILE_PATH, { encoding: 'utf8' }).then((data) => {
      const newData = data
        .split('\n')
        .filter((row) => {
          const [id, contactEncrypted, i] = row.split(',');
          return !!id && !!contactEncrypted && !!i;
        })
        .map((d) => {
          if (d.startsWith(uuid)) {
            return `${uuid},${content},${iv}`;
          }
          return d;
        });

      return fs.outputFile(FILE_PATH, newData.join('\n'));
    });
  }

  return Promise.reject(new Error('no file'));
}

export async function listContacts() {
  const exist = await fs.pathExists(FILE_PATH);

  if (exist) {
    return fs
      .readFile(FILE_PATH, { encoding: 'utf8' })
      .then(parseEncryptedContacts);
  }

  return [];
}
