import { InferType, object, string } from 'yup';

const stringFieldSchema = string().default('').trim();

export const contactSchema = object({
  name: stringFieldSchema.required('Enter name'),
  phone: stringFieldSchema,
  email: stringFieldSchema.required('Enter email').email(),
  address: stringFieldSchema,
});

export const contactEditSchema = contactSchema.shape({
  uuid: stringFieldSchema,
});

export type Contact = InferType<typeof contactSchema>;
export type ContactEdit = InferType<typeof contactEditSchema>;
