import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { updateSession, updateToken, userLogin } from "@/redux/api/authApi";
import { APP_ROUTES } from "@/utils/routes";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials: any, _req) => {
        const response = await userLogin({
          email: credentials?.email,
          password: credentials.password,
        });
        if (response?.status === "failure" && !response?.data) {
          throw new Error(response?.message);
        }

        return {
          id: response?.data?.patient?._id,
          name:
            response?.data?.patient?.firstName +
            " " +
            response?.data?.patient?.lastName,
          firstName: response?.data?.patient?.firstName,
          lastName: response?.data?.patient?.lastName,
          email: response?.data?.patient?.email,
          mobileNumber: response?.data?.patient?.mobileNumber,
          isEmailVerified: response?.data?.patient?.isEmailVerified,
          isProfileCompleted: response?.data?.patient?.isProfileCompleted,
          gender: response?.data?.patient?.gender,
        };
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token = updateToken(token, user);
      }
      if (trigger === "update") {
        if (session) {
          token = updateToken(token, session?.user);
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session = updateSession(session, token);
      }
      return session;
    },
  },
  pages: {
    signIn: APP_ROUTES.LOGIN,
  },
};

export default authOptions;
