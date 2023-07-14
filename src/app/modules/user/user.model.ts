import bcrypt from 'bcrypt';
import mongoose, { Schema, Types, model } from 'mongoose';
import config from '../../../config';
import { userRoles, wishlistFlags } from './user.constant';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: userRoles,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
    dateOfBirth: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalBooksPublished: {
      type: Number,
      default: 0,
    },
    isAuthor: {
      type: Boolean,
      default: false,
    },
    wishlist: {
      type: [
        {
          bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            require: true,
          },
          flag: {
            type: String,
            enum: wishlistFlags,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (email: string): Promise<
  | (Pick<IUser, 'role' | 'password'> & {
      _id: Types.ObjectId;
    })
  | null
> {
  return await User.findOne(
    { email },
    {
      _id: 1,
      phoneNumber: 1,
      password: 1,
      role: 1,
    }
  );
};

userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  currentPassword: string
) {
  return await bcrypt.compare(givenPassword, currentPassword);
};

userSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update: any = this.getUpdate();
    if (update.password) {
      update.password = await bcrypt.hash(
        update.password,
        Number(config.bcrypt_salt_rounds)
      );
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
