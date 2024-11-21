import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";
import { searchContacts } from "../controllers/ContactsController.js";

const ContactsRoutes = Router();
ContactsRoutes.post("/search", verifyToken, searchContacts)

export default ContactsRoutes;