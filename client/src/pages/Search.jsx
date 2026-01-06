import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../Component/ListingItem';


export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/user/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Sidebar */}
      <div className='bg-slate-800 p-7 border-b-2 border-slate-700 md:border-r-2 md:border-b-0 md:min-h-screen md:w-80'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-white font-semibold text-lg'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search properties...'
              className='bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-3'>
            <label className='text-white font-semibold text-lg'>Type:</label>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='all'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <span className='text-slate-300'>Rent & Sale</span>
              </div>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <span className='text-slate-300'>Rent</span>
              </div>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <span className='text-slate-300'>Sale</span>
              </div>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span className='text-slate-300'>Offer</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <label className='text-white font-semibold text-lg'>Amenities:</label>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span className='text-slate-300'>Parking</span>
              </div>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 text-blue-400 bg-slate-700 border-slate-600 rounded focus:ring-blue-400'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span className='text-slate-300'>Furnished</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white font-semibold text-lg'>Sort by:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg uppercase font-semibold transition-colors duration-200 shadow-lg'>
            Search Properties
          </button>
        </form>
      </div>

      {/* Results */}
      <div className='flex-1 bg-slate-900'>
        <div className='bg-slate-800 border-b border-slate-700 p-6'>
          <h1 className='text-2xl font-semibold text-white'>
            Search Results
          </h1>
        </div>
        
        <div className='p-6'>
          {!loading && listings.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-xl text-slate-400'>No properties found!</p>
              <p className='text-sm text-slate-500 mt-2'>Try adjusting your search criteria</p>
            </div>
          )}
          
          {loading && (
            <div className='text-center py-12'>
              <p className='text-xl text-slate-400'>Loading...</p>
            </div>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>

          {showMore && (
            <div className='text-center mt-8'>
              <button
                onClick={onShowMoreClick}
                className='bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors duration-200'
              >
                Show More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}