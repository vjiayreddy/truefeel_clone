import NextAuth, { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    gender?: string;
    address?: string;
    isEmailVerified?: boolean;
    studyRecordId?: string;
    studyId?: string;
    token?: string;
    isProfileCompleted?: boolean;
    dateOfBirth?: string;
    height?: number | null;
    weight?: number | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      mobileNumber?: string;
      email: ?string;
      gender?: string;
      address?: string;
      isEmailVerified?: boolean;
      token?: string;
      isProfileCompleted?: boolean;
      dateOfBirth?: string;
      height?: number | null;
      weight?: number | null;
      studyRecordId?: string;
      studyId?: string;
    };
  }
}
