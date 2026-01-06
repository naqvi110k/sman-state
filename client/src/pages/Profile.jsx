import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';
import { updateUserStart,updateUserSuccess,updateUserFailure,
  deleteUserStart,deleteUserSuccess,deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess
 } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, Camera, Settings, LogOut, Trash2, Plus, Edit, FileText } from 'lucide-react'

const Profile = () => {
  const {currentUser, loading } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file , setFile] = useState(undefined)
  const [formData , setFormData] = useState({})
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const dispatch = useDispatch();
  const [userListings, setuserListings] = useState([])
  const [showListings, setShowListings] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'username':
        if (value && value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters'
        } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Username can only contain letters, numbers, and underscores'
        } else {
          delete newErrors.username
        }
        break
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
      
      case 'password':
        if (value) {
          if (value.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
          } else {
            delete newErrors.password
          }
          
          // Calculate password strength
          let strength = 0
          if (value.length >= 8) strength++
          if (/[A-Z]/.test(value)) strength++
          if (/[a-z]/.test(value)) strength++
          if (/[0-9]/.test(value)) strength++
          if (/[^A-Za-z0-9]/.test(value)) strength++
          setPasswordStrength(strength)
        } else {
          delete newErrors.password
          setPasswordStrength(0)
        }
        break
      
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-blue-500'
      case 5: return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return ''
      case 1: return 'Very Weak'
      case 2: return 'Weak'
      case 3: return 'Fair'
      case 4: return 'Strong'
      case 5: return 'Very Strong'
      default: return ''
    }
  }

  const handleFileUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (!file) {
      toast.error('No file selected.');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG, and PNG files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB.');
      return;
    }

    const uploadUrl = import.meta.env.VITE_APP_API_KEY;
    const uploadPreset = import.meta.env.VITE_APP_PRESET;
    
    if (!uploadPreset) {
      toast.error('Upload preset not configured.');
      return;
    }
    
    if (!uploadUrl) {
      toast.error('Cloudinary upload URL not configured.');
      return;
    }

    setIsImageUploading(true);
    setImageUploadProgress(0);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);
    uploadFormData.append('folder', 'profile_images');
  
    axios.post(uploadUrl, uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      },
      timeout: 30000,
    })
    .then(response => {
      if (response.data && response.data.secure_url) {
        toast.success("Image uploaded successfully");
        setFormData(prevData => ({...prevData, avatar: response.data.secure_url}));
      } else {
        throw new Error('Invalid response from upload service');
      }
    })
    .catch(error => {
      toast.error(`Upload failed: ${error.message}`);
    })
    .finally(() => {
      setIsImageUploading(false);
      setImageUploadProgress(0);
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({...formData, [id]: value });
    validateField(id, value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(formData).length === 0) {
      toast.error('No changes detected');
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error('Please fix all errors before submitting')
      return
    }
    
    dispatch(updateUserStart())
    try {
      const response = await axios.post(`/api/user/update/${currentUser._id}`, formData)
      dispatch(updateUserSuccess(response.data.rest))
      toast.success("Profile updated successfully")
      setFormData({});
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
        dispatch(updateUserFailure(error.response.data.message));
      } else {
        dispatch(updateUserFailure(error.message)) 
        toast.error("Error: " + error.message)
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    dispatch(deleteUserStart())
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`)
      dispatch(deleteUserSuccess())
      toast.success("User deleted successfully")
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
        dispatch(deleteUserFailure(error.response.data.message));
      } else {
        dispatch(deleteUserFailure(error.message)) 
        toast.error("Error: " + error.message)
      }
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutUserStart())
    try {
      await axios.get("/api/auth/signout");
      dispatch(signOutUserSuccess())
      toast.success("Signed out successfully")  
    } catch (error) {
      toast.error("Error: " + error.message) 
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListing = async () => {
    try {
      setShowListings(!showListings);
      if (!showListings) {
        const response = await axios.get(`/api/user/listings/${currentUser._id}`)
        if(response.data.length === 0) {
          toast.error("No listings found.");
          return;
        }
        setuserListings(response.data)  
      }
    } catch (error) {
      toast.error("Error: " + error.message)
    }
  } 

  const handleListingDelete = async (listingId) => {
    try {
      await axios.delete(`/api/listing/delete/${listingId}`)
      toast.success("Listing deleted successfully")
      setuserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      toast.error("Error: " + error.message)
    }
  }

  return (
    <div className='min-h-screen bg-slate-800 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Settings className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-4xl font-bold text-white mb-2'>Profile Settings</h1>
          <p className='text-gray-300'>Manage your account information</p>
        </div>

        {/* Main Profile Card */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl mb-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            
         {/* Avatar Section */}
<div className='flex flex-col items-center mb-8'>
  <div className='relative group'>
    <div 
      onClick={() => fileRef.current.click()}
      className='w-32 h-32 rounded-full cursor-pointer transition-all duration-300 group-hover:border-blue-500 shadow-lg overflow-hidden border-4 border-gray-600 group-hover:border-blue-500'
    >
      <img 
        src={formData.avatar || currentUser.avatar} 
        alt="profile" 
        className='w-full h-full object-cover'
      />
    </div>
    {isImageUploading && (
      <div className='absolute inset-0 rounded-full bg-black/60 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2'></div>
          <div className='text-white text-sm font-medium'>{imageUploadProgress}%</div>
        </div>
      </div>
    )}
    <div className='absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 flex items-center justify-center cursor-pointer'
         onClick={() => fileRef.current.click()}>
      <Camera className='w-8 h-8 text-white' />
    </div>
  </div>
  <p className='text-sm text-gray-300 mt-3 flex items-center gap-2'>
    <Camera className='w-4 h-4' />
    Click to change avatar
  </p>
  <input 
    onChange={(e) => setFile(e.target.files[0])}
    type="file" 
    ref={fileRef} 
    hidden 
    accept='image/*'
  />
</div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className='block text-sm font-medium text-gray-200 mb-2'>
                Username
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input 
                  type="text"  
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                  placeholder='Enter username' 
                  id='username'
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
                />
                {!errors.username && formData.username && (
                  <CheckCircle className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500' />
                )}
              </div>
              {errors.username && (
                <p className='mt-1 text-sm text-red-400 flex items-center gap-1'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-200 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input 
                  type="email" 
                  defaultValue={currentUser.email}
                  onChange={handleChange}
                  placeholder='Enter email' 
                  id='email'
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
                New Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter new password (leave empty to keep current)' 
                  id='password' 
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className='mt-2'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-xs text-gray-300'>Password Strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength >= 4 ? 'text-green-400' : 
                      passwordStrength >= 3 ? 'text-yellow-400' : 
                      passwordStrength >= 1 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className='flex space-x-1'>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 rounded-full flex-1 transition-all ${
                          passwordStrength >= level ? getPasswordStrengthColor() : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className='mt-1 text-sm text-red-400 flex items-center gap-1'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Update Button */}
            <button 
              type="submit"
              disabled={loading || isImageUploading || Object.keys(errors).length > 0} 
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]'
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Updating Profile...
                </div>
              ) : isImageUploading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Uploading Image...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        </div>

        {/* Quick Actions Card */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6'>
          <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
            <Plus className='w-5 h-5' />
            Quick Actions
          </h3>
          
          <Link 
            className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center block flex items-center justify-center gap-2'
            to="/create-listing"
          >
            <Plus className='w-5 h-5' />
            Create New Listing
          </Link>
        </div>

        {/* Listings Section */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6'>
          <button 
            onClick={handleShowListing}
            className='w-full py-3 text-blue-400 hover:text-blue-300 font-medium hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
          >
            <FileText className='w-5 h-5' />
            {showListings ? 'Hide My Listings' : 'Show My Listings'}
          </button>

          {showListings && userListings && userListings.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className='text-2xl font-bold text-white text-center flex items-center justify-center gap-2'>
                <FileText className='w-6 h-6' />
                Your Listings
              </h2>
              <div className='space-y-4'>
                {userListings.map((listing) => (
                  <div 
                    key={listing._id} 
                    className="bg-white/5 border border-gray-600 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <Link to={`/listing/${listing._id}`} className="shrink-0">
                        <img 
                          src={listing.imageUrls[0]} 
                          className='h-20 w-20 object-cover rounded-lg border border-gray-600' 
                          alt="listing cover" 
                        />
                      </Link>
                      
                      <Link  
                        className='flex-1 min-w-0'
                        to={`/listing/${listing._id}`}
                      >
                        <h3 className='text-white font-semibold text-lg hover:text-blue-400 transition-colors duration-200 truncate'>
                          {listing.name}
                        </h3>
                        <p className='text-gray-400 text-sm'>Click to view details</p>
                      </Link>
                      
                      <div className="flex flex-col gap-2 shrink-0">
                        <Link 
                          to={`/update-listing/${listing._id}`}
                          className='px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 text-center flex items-center justify-center gap-1'
                        >
                          <Edit className='w-4 h-4' />
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleListingDelete(listing._id)} 
                          className='px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1'
                        >
                          <Trash2 className='w-4 h-4' />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className='bg-red-900/20 border border-red-500/30 backdrop-blur-lg rounded-2xl p-6 shadow-2xl'>
          <h3 className='text-xl font-bold text-red-400 mb-4 flex items-center gap-2'>
            <AlertCircle className='w-5 h-5' />
            Danger Zone
          </h3>
          
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='flex-1'>
              <button
                onClick={handleDeleteUser}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  deleteConfirm 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-500/30'
                }`}
              >
                <Trash2 className='w-4 h-4' />
                {deleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
              </button>
              
              {deleteConfirm && (
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className='ml-4 px-6 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200'
                >
                  Cancel
                </button>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className='px-6 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 border border-yellow-500/30 rounded-lg font-medium transition-all duration-200 flex items-center gap-2'
            >
              <LogOut className='w-4 h-4' />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile