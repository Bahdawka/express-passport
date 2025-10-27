import { Router } from 'express'
import { getProtectedPage } from '../controllers/protected.mjs'
import { ensureAuthenticated } from '../middleware/passport.mjs'

const router = Router()

router.get('/', ensureAuthenticated, getProtectedPage)

export default router