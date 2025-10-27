import { celebrate, Segments, Joi } from 'celebrate'

const articleSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  content: Joi.string().required().min(10).max(1000),
  author: Joi.string().required().min(3).max(50)
})

const validateArticlePost = celebrate({
  [Segments.BODY]: articleSchema
})

const validateArticlePut = celebrate({
  [Segments.BODY]: articleSchema
})

const articlePatchSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10).max(1000),
  author: Joi.string().min(3).max(50)
})

const validateArticlePatch = celebrate({
  [Segments.BODY]: articlePatchSchema
})

const validateArticleIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().required().min(1).max(10)
  })
})

export { validateArticlePost, validateArticlePut, validateArticlePatch, validateArticleIdParam }
