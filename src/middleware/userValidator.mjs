import { celebrate, Segments, Joi } from 'celebrate'

const userSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email(),
  age: Joi.number().required().min(0).max(100),
  city: Joi.string().required().min(2).max(50)
})

const validateUserPost = celebrate({
  [Segments.BODY]: userSchema
})

const validateUserPut = celebrate({
  [Segments.BODY]: userSchema
})

const userPatchSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().min(0).max(100),
  city: Joi.string().min(2).max(50)
})

const validateUserPatch = celebrate({
  [Segments.BODY]: userPatchSchema
})

const validateUserIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().required().min(1).max(10)
  })
})

export { validateUserPost, validateUserPut, validateUserPatch, validateUserIdParam }
