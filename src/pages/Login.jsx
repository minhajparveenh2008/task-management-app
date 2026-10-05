import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Password is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setEmail('alex@taskflow.io');
    setPassword('Password123!');
    setLoading(true);
    try {
      await login({ email: 'alex@taskflow.io', password: 'Password123!' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Identity */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center text-white">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            TaskFlow
          </span>
        </div>
        <p className="mt-1.5 text-center text-xs font-medium text-neutral-500">
          Plan. Track. Complete.
        </p>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-neutral-900">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-center text-sm text-neutral-600">
          Access your workspace and manage your tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-7 px-6 border border-neutral-200 rounded-lg sm:px-8">
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-teal-700 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-teal-700 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>

          {/* Quick Demo Workspace Access */}
          <div className="mt-5 pt-5 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              Continue with Demo Account (alex@taskflow.io)
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
