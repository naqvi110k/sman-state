import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../Component/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/user/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/user/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/user/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-white font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-blue-300'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-slate-300 text-xs sm:text-sm'>
          SMAN Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <div className='relative max-w-6xl mx-auto px-3'>
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px] relative rounded-lg overflow-hidden'
                >
                  {/* Dark overlay for better text visibility */}
                  <div className='absolute inset-0 bg-black bg-opacity-40'></div>
                  
                  {/* Content overlay */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center text-white px-4'>
                      <h2 className='text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg'>
                        Featured Properties
                      </h2>
                      <p className='text-lg md:text-xl mb-6 drop-shadow-lg opacity-90'>
                        Discover amazing deals on premium properties
                      </p>
                      <Link 
                        to={`/listing/${listing._id}`}
                        className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg'
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        
        {/* Bottom gradient for smooth transition */}
        <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none rounded-b-lg'></div>
      </div>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent offers</h2>
              <Link className='text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent places for rent</h2>
              <Link className='text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent places for sale</h2>
              <Link className='text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}