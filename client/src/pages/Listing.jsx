import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { useSelector } from 'react-redux';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaCar,
  FaEye,
} from 'react-icons/fa';

// Lazy load Contact component
const Contact = lazy(() => import("../Component/Contact"));

const PAGE_BG = 'rgb(28, 44, 60)';
const CARD_BG = 'rgba(46, 62, 81, 0.8)';

// Loading skeleton
const LoadingSkeleton = React.memo(() => (
  <div className="animate-pulse min-h-screen" style={{ backgroundColor: PAGE_BG }}>
    <div className="h-16 bg-slate-700/30 border-b border-slate-600 mb-6"></div>
    <div className="h-[400px] md:h-[600px] bg-slate-600/50 w-full"></div>
    <div className="max-w-5xl mx-auto p-4">
      <div className="h-8 bg-slate-600/50 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-600/50 rounded-lg mb-6 w-1/2"></div>
      <div className="h-12 bg-slate-600/50 rounded-lg mb-6 w-1/4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-600/50 rounded-lg"></div>
        ))}
      </div>
      <div className="h-6 bg-slate-600/50 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-600/50 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-600/50 rounded-lg mb-4 w-3/4"></div>
      <div className="h-10 bg-slate-600/50 rounded-lg mb-6 w-1/3"></div>
    </div>
  </div>
));

// Error message
const ErrorMessage = React.memo(({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: PAGE_BG }}>
    <div className="max-w-lg mx-auto text-center p-8 bg-slate-800/70 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Property Not Found</h2>
      <p className="text-slate-300 mb-6">We couldn't locate this property.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition"
        >
          Try Again
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-500 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
));

// Price display
const PriceDisplay = React.memo(({ listing }) => {
  const price = useMemo(() => listing.offer ? listing.discountedPrice : listing.regularPrice, [listing]);

  return (
    <div className="bg-slate-800/70 p-4 rounded-lg shadow-md inline-block">
      <span className="text-3xl font-bold text-white">${Number(price).toLocaleString("en-US")}</span>
      {listing.type === 'rent' && <span className="text-slate-300 ml-2">/month</span>}
      {listing.offer && (
        <span className="block text-sm text-green-400 mt-1">
          Discounted from ${Number(listing.regularPrice).toLocaleString("en-US")}
        </span>
      )}
    </div>
  );
});

// Property features
const PropertyFeatures = React.memo(({ listing }) => {
  const features = useMemo(() => [
    { icon: FaBed, value: listing.bedrooms, label: listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom' },
    { icon: FaBath, value: listing.bathrooms, label: listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom' },
    { icon: FaCar, value: listing.parking ? 'Available' : 'Not Available', label: 'Parking' },
    { icon: FaChair, value: listing.furnished ? 'Furnished' : 'Unfurnished', label: 'Furnishing' },
  ], [listing]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {features.map((feature, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-700/70 shadow-md transition-transform hover:scale-105"
        >
          <feature.icon className="text-white text-xl mb-2" />
          <div className="font-semibold text-white">{feature.value}</div>
          <div className="text-slate-300 text-sm">{feature.label}</div>
        </div>
      ))}
    </div>
  );
});

// Actions row
const ActionsRow = ({ isFavorite, onToggleFavorite, views }) => (
  <div className="flex flex-wrap gap-3 mt-6">
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
          .then(() => toast.success("Link copied to clipboard!"))
          .catch(() => toast.error("Failed to copy link"));
      }}
      className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 text-white rounded-lg hover:bg-slate-600 transition"
    >
      <FaShareAlt /> Share
    </button>
    <button
      onClick={onToggleFavorite}
      className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 text-white rounded-lg hover:bg-slate-600 transition"
    >
      {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      {isFavorite ? "Saved" : "Save"}
    </button>
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 text-white rounded-lg">
      <FaEye /> {views} {views === 1 ? 'view' : 'views'}
    </div>
  </div>
);

// Back button
const BackButton = ({ navigate }) => (
  <div className="p-4">
    <button
      onClick={() => navigate(-1)}
      className="text-white flex items-center gap-2 hover:underline transition"
    >
      <FaArrowLeft /> Back to Listings
    </button>
  </div>
);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [views, setViews] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(`/api/listing/get/${params.listingId}`);
      if (res.data) {
        setListing(res.data);
        setViews(res.data.views || 0);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error(error.response?.data?.message || "Failed to load property details.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.listingId]);

  useEffect(() => {
    if (params.listingId) {
      fetchListing();
      axios.post(`/api/listing/views/${params.listingId}`).catch(() => {});
    }
  }, [fetchListing, params.listingId]);

  const imageUrls = useMemo(() => listing?.imageUrls || [], [listing]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites");
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !listing) return <ErrorMessage onRetry={fetchListing} />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      <BackButton navigate={navigate} />

      {/* Full-width image gallery */}
      <div className="relative w-full">
        {imageUrls.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination, Thumbs, FreeMode]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
              className="h-[400px] md:h-[600px] w-full"
            >
              {imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    alt={`${listing.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="max-w-7xl mx-auto px-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper mt-2 rounded-lg overflow-hidden"
              >
                {imageUrls.map((url, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <img
                      src={url}
                      alt={`${listing.name} - ${index + 1}`}
                      className={`w-full h-20 object-cover ${activeImageIndex === index ? 'border-2 border-blue-500' : ''}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-thumbnail.jpg";
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <div className="h-[400px] md:h-[600px] flex items-center justify-center bg-slate-700/50 text-white">
            No images available
          </div>
        )}
      </div>

      {/* Property details card */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-slate-800/70 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-3xl font-bold text-white mb-2 md:mb-0">{listing.name}</h1>
            <PriceDisplay listing={listing} />
          </div>

          <div className="flex items-center gap-2 text-slate-300 mb-6">
            <FaMapMarkerAlt className="text-blue-400" />
            <span>{listing.address}</span>
          </div>

          <PropertyFeatures listing={listing} />

          <ActionsRow
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            views={views}
          />

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-slate-300 leading-relaxed">
              {listing.description || "No description available"}
            </p>
          </div>

          {currentUser && listing.userRef !== currentUser._id && (
            <div className="mt-8 flex justify-center">
              {!contact ? (
                <button
                  onClick={() => setContact(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition"
                >
                  Contact Owner
                </button>
              ) : (
                <Suspense fallback={<div className="text-white">Loading contact form...</div>}>
                  <Contact listing={listing} onClose={() => setContact(false)} />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
