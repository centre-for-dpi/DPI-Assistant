"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  type SignInInput,
  type SignUpInput,
  type ConfirmSignUpInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
import { amplifyConfig } from '@/lib/cognito-config';

// Configure Amplify
Amplify.configure(amplifyConfig);

export interface User {
  userId: string;
  email: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setUser({
        userId: currentUser.userId,
        email: currentUser.signInDetails?.loginId || '',
        emailVerified: true,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(email: string, password: string) {
    try {
      const input: SignInInput = {
        username: email,
        password,
      };

      await signIn(input);
      await checkUser();
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async function handleSignUp(email: string, password: string, name?: string) {
    try {
      const input: SignUpInput = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            ...(name && { name }),
          },
        },
      };

      await signUp(input);
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  async function handleConfirmSignUp(email: string, code: string) {
    try {
      const input: ConfirmSignUpInput = {
        username: email,
        confirmationCode: code,
      };

      await confirmSignUp(input);
    } catch (error: any) {
      console.error('Error confirming sign up:', error);
      throw new Error(error.message || 'Failed to confirm sign up');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async function handleResendConfirmationCode(email: string) {
    try {
      await resendSignUpCode({ username: email });
    } catch (error: any) {
      console.error('Error resending confirmation code:', error);
      throw new Error(error.message || 'Failed to resend confirmation code');
    }
  }

  async function handleResetPassword(email: string) {
    try {
      const input: ResetPasswordInput = {
        username: email,
      };

      await resetPassword(input);
    } catch (error: any) {
      console.error('Error initiating password reset:', error);
      throw new Error(error.message || 'Failed to initiate password reset');
    }
  }

  async function handleConfirmPasswordReset(email: string, code: string, newPassword: string) {
    try {
      const input: ConfirmResetPasswordInput = {
        username: email,
        confirmationCode: code,
        newPassword,
      };

      await confirmResetPassword(input);
    } catch (error: any) {
      console.error('Error confirming password reset:', error);
      throw new Error(error.message || 'Failed to confirm password reset');
    }
  }

  async function getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signOut: handleSignOut,
    resendConfirmationCode: handleResendConfirmationCode,
    resetPassword: handleResetPassword,
    confirmPasswordReset: handleConfirmPasswordReset,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
