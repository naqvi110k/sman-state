import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
    
    export const updateUser = async (req, res, next) => {
        if (String(req.user.id) !== String(req.params.id)) {
            return res.status(401).json({ message: 'You can only update your account' });
        } 
        try {

            if (req.body.password){
             req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar : req.body.avatar

                }
            }, {new: true})

        const {password, ...rest} = updatedUser._doc
       res.status(200).json({ message: 'User updated successfully', rest });
        } catch (error) {
            next(error);   
        }


    }

   export const deleteUser = async (req, res,next) => {
    if (String(req.user.id) !== String(req.params.id)) {
            return res.status(401).json({ message: 'You can only delete your account' });
        }
       try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("acess_token");
        res.status(200).json({ message: 'User deleted successfully' })
        
       } catch (error) {
        next(error);
         } 

   } 

   export const getUserListings = async (req, res,next) => {
    if(String(req.user.id) === String(req.params.id)){
      try {
        const listing = await Listing.find({useRef :req.params.id})
        res.status(200).json(listing)  
      } catch (error) {
        next(error);  
      }


    }
    else {
        return res.status(401).json({message: "you can only view your own listings"})
    }
   }

   export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const {password: pass, ...rest } = user._doc
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
   }
   
   export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
