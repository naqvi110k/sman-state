import React from 'react'
import {BrowserRouter, Routes , Route} from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Header from './Component/Header'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './Component/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes className>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path='/search' element={<Search />} />
      <Route path ="/listing/:listingId" element={<Listing />} />
      <Route element={<PrivateRoute />} >
      <Route path="/profile" element={<Profile />} />
      <Route path ="/create-listing" element ={<CreateListing/>}/>
      <Route path ="/update-listing/:listingId"
       element={<UpdateListing/>} />
      </Route>
    </Routes>
    <Toaster/>
    </BrowserRouter>
  )
}

export default App
