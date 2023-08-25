import express from 'express'
import { getDashboardData } from '../../controllers/admin/dashboard'

const adminDashboardRouter = express.Router()
adminDashboardRouter.get('/dashboard', getDashboardData)


export default adminDashboardRouter