import { Router } from "express"
import * as priceComparisonController from "../controllers/price-comparison.controller.js"

export const priceComparisonRouter=Router()

priceComparisonRouter.post("/",priceComparisonController.priceComparison)