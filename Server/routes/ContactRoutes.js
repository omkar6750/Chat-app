import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactsController.js";

const ContactsRoutes = Router();
ContactsRoutes.post("/search", verifyToken, searchContacts)
ContactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList)
ContactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default ContactsRoutes;