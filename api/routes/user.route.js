import express  from "express"
import { deleteUser, updateUser,getListings , getUserListings, getUser} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";



const router = express.Router();

router.get("/test", ()=>{
    console.log('Hello from the API endpoint!');
})
router.post("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)
router.get("/listings/:id", verifyToken,getUserListings)
router.get("/get/:id", verifyToken, getUser)
router.get("/get",getListings)

export default router;

