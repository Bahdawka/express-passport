import { Router } from 'express'
import rootRouter from './root.mjs'
import usersRouter from './users.mjs'
import articlesRouter from './articles.mjs'
import authRouter from './auth.mjs'
import settingsRouter from './settings.mjs'
import protectedRouter from './protected.mjs'

const router = Router()

router.use('/', rootRouter)
router.use('/users', usersRouter)
router.use('/articles', articlesRouter)
router.use('/auth', authRouter)
router.use('/settings', settingsRouter)
router.use('/protected', protectedRouter)

export default router