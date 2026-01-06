import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const  signup =  async(req,res,next) =>{
    
try {
    
    const { username, email, password } = req.body;


    // Validate request data
    if(!username ||!email ||!password){
        return res.status(500).json({ message: 'All fields are required' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if(existingEmail || existingUser){
        return res.status(500).json({ message: 'Please try using a different username or email address.' });
    }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        // Return a success message
        res.status(201).json({ message: 'User created successfully' });
    

    
} catch (error) {
    next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email , password} = req.body;

    try {
        // Validate request data
        if(!email ||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials' });
        }   

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with expiration
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("acess_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict' // Prevent CSRF attacks
        }) 
         const {password: pass , ...rest} = user._doc
        res.json({ message: 'User authenticated successfully', rest});





        
        
    } catch (error) {
        next(error);
    }
}
export const google =async (req, res, next ) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if (user){
              // Generate JWT token with expiration
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.cookie("acess_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict' // Prevent CSRF attacks
            }) 
            const {password: pass,...rest} = user._doc
            res.json({ message: 'User authenticated successfully', rest});
        }
        else{
            const generatedPassword =  Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8) ,
                email: req.body.email,
                password: hashedPassword,
                avatar : req.body.avatar
            })
            await newUser.save()
            // Generate JWT token with expiration
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.cookie("acess_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict' // Prevent CSRF attacks
            }) 
            const {password: pass,...rest} = newUser._doc
            res.status(200).json({ message: 'User authenticated successfully', rest});
        }
        
    } catch (error) {
        next(error);
    }
}

export const signOut = (req, res,next) => {
    try {
        res.clearCookie("acess_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'User signed out successfully' });   
    } catch (error) {
       next(error);
    }

}

