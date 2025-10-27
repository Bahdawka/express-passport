import { Router } from 'express'
import { getRootHandler } from '../controllers/root.mjs'
import { optionalAuthenticated } from '../middleware/passport.mjs'

export const router = Router()

router.get('/', optionalAuthenticated, getRootHandler)

export default router