import { Router } from 'express'
import {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  deleteArticleByIdHandler,
  putArticleByIdHandler,
  patchArticleByIdHandler
} from '../controllers/articles.mjs'
import { basicAuth } from '../middleware/auth.mjs'
import { optionalAuthenticated } from '../middleware/passport.mjs'
import { validateArticlePost, validateArticlePut, validateArticlePatch, validateArticleIdParam } from '../middleware/articleValidator.mjs'

export const router = Router()

router.route('/')
  .get(optionalAuthenticated, getArticlesHandler)
  .post(basicAuth, validateArticlePost, postArticlesHandler)

router.route('/:articleId')
  .get(optionalAuthenticated, validateArticleIdParam, getArticleByIdHandler)
  .delete(basicAuth, validateArticleIdParam, deleteArticleByIdHandler)
  .put(basicAuth, validateArticleIdParam, validateArticlePut, putArticleByIdHandler)
  .patch(basicAuth, validateArticleIdParam, validateArticlePatch, patchArticleByIdHandler)

export default router