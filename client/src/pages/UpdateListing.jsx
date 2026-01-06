import axios from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const {currentUser} = useSelector(state => state.user)
  const [files, setFiles] = useState([])
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId  
        const response = await axios.get(`/api/listing/get/${listingId}`)
        setFormData(response.data)
      } catch (error) {
        toast.error('Error fetching listing data')
        console.error('Error fetching listing:', error)
      }
    }
    fetchListing()
  }, [])

  const navigate = useNavigate()
  const params = useParams()
  
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 50,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser._id,
  })
  
  const handleImageSubmit = (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      toast.error('Please select at least one image')
      return
    }
    
    if (files.length > 6) {
      toast.error('You can only upload a maximum of 6 images')
      return
    }
    
    if (files.length + formData.imageUrls.length > 6) {
      toast.error(`You can only add ${6 - formData.imageUrls.length} more images`)
      return
    }

    setUpload(true)
    const promises = [];
    
    for (let i = 0; i < files.length; i++) {
      promises.push(uploadImage(files[i], i));
    }
    
    Promise.all(promises).then((urls) => {
      setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
      setUpload(false)
      setFiles([])
      setUploadProgress({})
      toast.success(`Successfully uploaded ${urls.length} images`)
    }).catch((err) => {
      toast.error('Error uploading images');
      setUpload(false)
      setUploadProgress({})
      console.error('Upload error:', err)
    });
  }
  
  const uploadImage = async (file, index) => {
    return new Promise((resolve, reject) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      // Validation
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${index + 1}: Only JPEG, JPG, and PNG files are allowed`);
        reject(new Error('Invalid file type'));
        return;
      }

      if (file.size > maxSize) {
        toast.error(`File ${index + 1}: File size must be less than 2MB`);
        reject(new Error('File too large'));
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', import.meta.env.VITE_APP_PRESET);
      uploadFormData.append('folder', 'listings');

      const API_URL = import.meta.env.VITE_APP_API_KEY;
      
      axios.post(API_URL, uploadFormData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({...prev, [index]: progress}));
        }
      })
      .then(response => {
        resolve(response.data.secure_url)
      })
      .catch(error => {
        toast.error(`Error uploading file ${index + 1}`);
        reject(error);
      });
    })
  }

  const handleImageDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })  
    toast.success('Image removed successfully')
  }

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id
      })   
    }
    
    if (e.target.id === "offer" || e.target.id === "parking" || e.target.id === "furnished") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    
    if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.imageUrls.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }
      
      if (+formData.discountedPrice >= +formData.regularPrice && formData.offer) {
        toast.error("Discounted price must be lower than regular price");
        return;
      }
      
      setLoading(true);

      const response = await axios.post(`/api/listing/update/${params.listingId}`, formData)
      toast.success('Listing updated successfully!');
      setLoading(false);
      navigate(`/listing/${response.data.updatedListing._id}`) 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error updating listing';
      toast.error(errorMessage);
      console.error('Update error:', error);
      setLoading(false); 
    }
  }  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Update Listing</h1>
          <p className="text-gray-400">Modify your property listing details</p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Property Details */}
            <div className="flex-1 space-y-6">
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2-7l2-2m0 0l2 2m-2-2v6" />
                  </svg>
                  Property Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Property Name</label>
                    <input
                      type="text" 
                      placeholder="Enter property name" 
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      id="name"
                      maxLength="62" 
                      minLength="10" 
                      required 
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea 
                      placeholder="Describe your property..." 
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                      id="description"
                      required
                      onChange={handleChange}
                      value={formData.description}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <input 
                      type="text" 
                      placeholder="Enter property address"
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      id="address"
                      required 
                      onChange={handleChange}
                      value={formData.address}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type & Features */}
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Property Type & Features
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <label className="flex items-center p-3 bg-gray-600/30 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-200">
                    <input type="checkbox" id="sale" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                           onChange={handleChange} 
                           checked={formData.type === 'sale'}
                    />
                    <span className="ml-2 text-white">For Sale</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-gray-600/30 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-200">
                    <input type="checkbox" id="rent" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                           onChange={handleChange}
                           checked={formData.type === 'rent'}
                    />
                    <span className="ml-2 text-white">For Rent</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-gray-600/30 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-200">
                    <input type="checkbox" id="parking" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                           onChange={handleChange}
                           checked={formData.parking}
                    />
                    <span className="ml-2 text-white">Parking</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-gray-600/30 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-200">
                    <input type="checkbox" id="furnished" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                           onChange={handleChange}
                           checked={formData.furnished}
                    />
                    <span className="ml-2 text-white">Furnished</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-gray-600/30 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-200">
                    <input type="checkbox" id="offer" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                           onChange={handleChange}
                           checked={formData.offer}
                    />
                    <span className="ml-2 text-white">Special Offer</span>
                  </label>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
                    <input type="number" 
                           id="bedrooms"
                           min="1" max="10" 
                           required 
                           className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                           onChange={handleChange}
                           value={formData.bedrooms}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
                    <input type="number"
                           id="bathrooms"
                           min="1" max="10"
                           required
                           className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                           onChange={handleChange}
                           value={formData.bathrooms}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Regular Price {formData.type === "rent" && <span className="text-xs text-gray-400">($/Month)</span>}
                    </label>
                    <input type="number" 
                           min="50"
                           max="10000000"
                           id="regularPrice" 
                           required
                           className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                           onChange={handleChange}
                           value={formData.regularPrice}
                    />
                  </div>
                  
                  {formData.offer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discounted Price {formData.type === "rent" && <span className="text-xs text-gray-400">($/Month)</span>}
                      </label>
                      <input type="number" 
                             min="0"
                             max="10000000"
                             id="discountedPrice" 
                             required 
                             className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                             onChange={handleChange}
                             value={formData.discountedPrice}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Images */}
            <div className="flex-1 space-y-6">
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Property Images
                  <span className="ml-2 text-sm text-gray-400">({formData.imageUrls.length}/6)</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">The first image will be the cover photo</p>
                
                {/* Upload Section */}
                <div className="mb-6">
                  <div className="flex gap-4">
                    <input 
                      onChange={(e) => setFiles(e.target.files)} 
                      className="flex-1 p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 transition-all duration-200"  
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png"
                      multiple 
                      disabled={upload}
                    />
                    <button 
                      disabled={upload || formData.imageUrls.length >= 6} 
                      type="button" 
                      onClick={handleImageSubmit}
                      className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {upload ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  
                  {/* Upload Progress */}
                  {upload && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(uploadProgress).map(([index, progress]) => (
                        <div key={index} className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Gallery */}
                {formData.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Uploaded Images</h3>
                    <div className="space-y-3">
                      {formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex items-center gap-4 p-4 bg-gray-600/30 rounded-xl border border-gray-600">
                          <div className="relative">
                            <img 
                              src={url} 
                              alt={`Property image ${index + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-500" 
                            />
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                Cover
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">Image {index + 1}</p>
                            <p className="text-sm text-gray-400">
                              {index === 0 ? 'Cover photo' : 'Gallery image'}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleImageDelete(index)}
                            type="button" 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8">
                  <button 
                    disabled={loading || upload} 
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Updating Listing...' : upload ? 'Wait for Upload...' : 'Update Listing'}
                  </button>  
                </div>
              </div>
            </div>    
          </form>
        </div>
      </div>
    </div>
  )
}