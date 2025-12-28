import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import authService from '../../services/authService'

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ error, setError ] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success('Registered successfully');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50'>
      <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-[length:16px_16px] opacity-20'></div>
      <div className='relative w-full max-w-md px-6'>
        <div className='bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-3xl shadow-xl shadow-indigo-200/30 p-10'>
          {/* Header */}
          <div className='text-center mb-10'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-6'>
              <BrainCircuit className='w-7 h-7 text-white' strokeWidth={2} />
            </div>
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
              Create your account
            </h1>
            <p className='text-indigo-600/70 text-sm'>
              Sign up to start your journey
            </p>
          </div>

          {/* Form */}
          <div className='space-y-5'>
            {/* Username Field */}
            <div className='space-y-2'>
              <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                Username
              </label>
              <div className='relative group'>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className='w-full pl-4 pr-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50/30 text-slate-900 placeholder-indigo-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10'
                  placeholder='Choose a username'
                />
              </div>
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                Email
              </label>
              <div className='relative group'>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-500' : 'text-indigo-400'}`}>
                  <Mail className='w-5 h-5' strokeWidth={2} />
                </div>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className='w-full pl-12 pr-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50/30 text-slate-900 placeholder-indigo-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10'
                  placeholder='Enter your email'
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                Password
              </label>
              <div className='relative group'>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-500' : 'text-indigo-400'}`}>
                  <Lock className='w-5 h-5' strokeWidth={2} />
                </div>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className='w-full pl-12 pr-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50/30 text-slate-900 placeholder-indigo-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10'
                  placeholder='Choose a secure password'
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='rounded-lg bg-red-50 border border-red-200 p-3'>
                <p className='text-xs text-red-600 font-medium text-center'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className='group relative w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-[0.98] text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-500/30 overflow-hidden'
            >
              <span>
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Registering…
                  </span>
                ) : (
                  <> 
                    Sign up
                    <ArrowRight className='w-5 h-5 ml-2 inline' strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 pt-6 border-t border-slate-200/60'>
          <p className='text-center text-sm text-indigo-600/80'>
            Already have an account?{' '}
            <Link to='/login' className='font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200'>
              Sign in
            </Link>
          </p>
        </div>

        {/* Subtle Footer text */}
        <p className='text-center text-xs text-slate-400 mt-6'>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
