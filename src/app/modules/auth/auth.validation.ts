import { z } from 'zod';

const registerUserSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
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
    dateOfBirth: z.date().optional(),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'phoneNumber is required',
      })
      .email(),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refresh token is required',
    }),
  }),
});

export const AuthValidationZodSchema = {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
};
