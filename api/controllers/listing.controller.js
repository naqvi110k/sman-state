import Listing from "../models/listing.model.js";

export const createListing = async (req,res,next) =>{
    try {
    const listing = await Listing.create(req.body);
    res.status(201).json({message: "Listing created successfully", listing});
    } catch (error) {
        next(error);   
    }

}

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if(String(req.user.id) !== String(listing.useRef)) {
    return res.status(403).json({ message: "You can only delete your own listing" });
  }
  try {
    await Listing.findByIdAndDelete(req.params.id)
   res.status(200).json({ message: "Listing deleted successfully" });   
  } catch (error) {
    next(error);
  }
}

export const updateListing = async (req, res, next) => {
  const listing  = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if(String(req.user.id) !== String(listing.useRef)) {
    return res.status(403).json({ message: "You can only update your own listing" });
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });
    res.status(200).json({ message: "Listing updated successfully", updatedListing });
    
  } catch (error) {
    next(error)
  }
}


export const getListing  = async (req, res, next) => {
try {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.status(200).json(listing);
  
} catch (error) {
  next(error)
}
}
