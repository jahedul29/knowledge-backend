import { z } from 'zod';
import { userRoles } from './user.constant';

const createUserZodValidateSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'firstName is required',
      }),
      lastName: z.string({
        required_error: 'lastName is required',
      }),
    }),
    address: z.string({
      required_error: 'address is required',
    }),
  }),
});

const updateZodValidateSchema = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    role: z.enum([...userRoles] as [string, ...string[]]).optional(),
    password: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
  }),
});

export const UserValidationSchema = {
  createUserZodValidateSchema,
  updateZodValidateSchema,
};
