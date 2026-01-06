import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import { OAuth } from '../Component/OAuth'
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, LogIn } from 'lucide-react'

const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          newErrors.email = 'Email is required'
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
      
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters'
        } else {
          delete newErrors.password
        }
        break
      
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
    validateField(id, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields before submission
    const requiredFields = ['email', 'password']
    const newErrors = {}
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix all errors before submitting')
      return
    }

    dispatch(signInStart())
    try {
      const response = await axios.post("/api/auth/signin", formData)
      dispatch(signInSuccess(response.data.rest))
      navigate("/")
      toast.success("Welcome back! Signed in successfully.")
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
        dispatch(signInFailure(error.response.data.message))
      } else {
        toast.error("Something went wrong. Please try again.")
        dispatch(signInFailure("Network error"))
      }
    }
  }

  return (
    <div className='min-h-screen bg-slate-800 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
            <LogIn className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
          <p className='text-gray-300'>Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-200 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
                />
                {!errors.email && formData.email && formData.email.includes('@') && (
                  <CheckCircle className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500' />
                )}
              </div>
              {errors.email && (
                <p className='mt-1 text-sm text-red-400 flex items-center gap-1'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-200 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-400 flex items-center gap-1'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='text-right'>
              <Link to="/forgot-password" className='text-sm text-blue-400 hover:text-blue-300 transition-colors'>
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]'
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-600'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-transparent text-gray-400'>or continue with</span>
              </div>
            </div>
            
            {/* Enhanced Google OAuth Button */}
            <button
              type="button"
              className='w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3'
              onClick={() => {
                // This will trigger your existing OAuth component's functionality
                document.querySelector('.oauth-component button')?.click()
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Hidden OAuth component for functionality */}
            <div className='oauth-component hidden'>
              <OAuth />
            </div>
          </form>

          {/* Sign Up Link */}
          <div className='text-center mt-6 pt-6 border-t border-gray-600'>
            <p className='text-gray-300'>
              Don't have an account?{' '}
              <Link to="/sign-up" className='text-blue-400 hover:text-blue-300 font-medium transition-colors'>
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-8 text-gray-400 text-sm'>
          <p>Secure sign-in with advanced encryption</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn