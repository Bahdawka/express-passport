import { Router } from 'express'
import { 
  getLoginPage, 
  login, 
  logout, 
  getProfile,
  getRegisterPage,
  register
} from '../controllers/auth.mjs'
import { ensureAuthenticated, ensureGuest } from '../middleware/passport.mjs'

const router = Router()

router.get('/login', ensureGuest, getLoginPage)
router.post('/login', ensureGuest, login)
router.get('/register', ensureGuest, getRegisterPage)
router.post('/register', ensureGuest, register)
router.post('/logout', logout)
router.get('/profile', ensureAuthenticated, getProfile)

export default router