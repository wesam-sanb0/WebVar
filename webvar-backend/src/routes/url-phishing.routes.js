import { Router } from "express"
import { checkUrlSafety } from './../controllers/url-phishing.controller.js';


export const urlPhishingRouter=Router()

urlPhishingRouter.post("/",checkUrlSafety)