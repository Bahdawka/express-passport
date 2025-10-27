import { Router } from 'express'
import {
  getUserHandler,
  postUserHandler,
  getUserByIdHandler,
  deleteUserByIdHandler,
  putUserByIdHandler,
  patchUserByIdHandler
} from '../controllers/users.mjs'
import { validateUserPost, validateUserPut, validateUserPatch, validateUserIdParam } from '../middleware/userValidator.mjs'
import { ensureAuthenticated } from '../middleware/passport.mjs'

export const router = Router()

router.route('/')
  .get(ensureAuthenticated, getUserHandler)
  .post(ensureAuthenticated, validateUserPost, postUserHandler)

router.route('/:userId')
  .get(ensureAuthenticated, validateUserIdParam, getUserByIdHandler) 
  .delete(ensureAuthenticated, validateUserIdParam, deleteUserByIdHandler)
  .put(ensureAuthenticated, validateUserIdParam, validateUserPut, putUserByIdHandler)
  .patch(ensureAuthenticated, validateUserIdParam, validateUserPatch, patchUserByIdHandler)

export default router