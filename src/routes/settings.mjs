import { Router } from 'express'
import { 
  getSettingsPage, 
  setTheme
} from '../controllers/settings.mjs'
import { optionalAuthenticated } from '../middleware/passport.mjs'

const router = Router()

router.use(optionalAuthenticated)
router.get('/', getSettingsPage)
router.post('/theme', setTheme)

export default router