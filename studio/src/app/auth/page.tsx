"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DPISageLogo } from '@/components/DPISageLogo';
import { Alert } from '@/components/ui/alert';
import { Loader } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'confirm' | 'forgot-password' | 'reset-password';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { signIn, signUp, confirmSignUp, resetPassword, confirmPasswordReset, resendConfirmationCode } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signUp(email, password, name);
      setSuccess('Account created! Please check your email for a confirmation code.');
      setMode('confirm');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await confirmSignUp(email, confirmationCode);
      setSuccess('Email confirmed! You can now sign in.');
      setMode('signin');
      setConfirmationCode('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Password reset code sent to your email.');
      setMode('reset-password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await confirmPasswordReset(email, confirmationCode, newPassword);
      setSuccess('Password reset successfully! You can now sign in.');
      setMode('signin');
      setConfirmationCode('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resendConfirmationCode(email);
      setSuccess('Confirmation code resent to your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <DPISageLogo size={80} className="text-primary" />
          </div>
          <CardTitle className="text-2xl text-center" style={{color: '#4285F4'}}>
            {mode === 'signin' && 'Sign in to DPI Sage'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'confirm' && 'Confirm your email'}
            {mode === 'forgot-password' && 'Reset your password'}
            {mode === 'reset-password' && 'Set new password'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'signin' && 'Enter your credentials to access DPI Sage'}
            {mode === 'signup' && 'Sign up to start using DPI Sage'}
            {mode === 'confirm' && 'Enter the code sent to your email'}
            {mode === 'forgot-password' && 'Enter your email to receive a reset code'}
            {mode === 'reset-password' && 'Enter the code and your new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-50 text-red-900 border-red-200">
              {error}
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
              {success}
            </Alert>
          )}

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{background: '#4285F4'}}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
              <div className="space-y-2 text-sm text-center">
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Forgot password?
                </button>
                <div>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:underline font-medium"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500">
                  Minimum 8 characters, including uppercase, lowercase, and numbers
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{background: '#4285F4'}}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Sign Up'}
              </Button>
              <div className="text-sm text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {mode === 'confirm' && (
            <form onSubmit={handleConfirmSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Confirmation Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="123456"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{background: '#4285F4'}}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Confirm Email'}
              </Button>
              <div className="text-sm text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Resend code
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:underline"
                    disabled={loading}
                  >
                    Back to sign in
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{background: '#4285F4'}}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Send Reset Code'}
              </Button>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {mode === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Reset Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500">
                  Minimum 8 characters, including uppercase, lowercase, and numbers
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{background: '#4285F4'}}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Reset Password'}
              </Button>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"><Loader className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <AuthPageContent />
    </Suspense>
  );
}
