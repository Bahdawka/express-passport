import express from 'express'
import session from 'express-session'
import router from './routes/index.mjs'
import { errors } from 'celebrate'

import favicon from 'serve-favicon'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import passport from './config/passport.mjs'
import { optionalAuthenticated } from './middleware/passport.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000
const app = express()

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.engine('ejs', (await import('ejs')).renderFile)

app.use(favicon(path.join(__dirname, '../public/favicon.png')))

app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Конфігурація сесій
app.use(session({
  secret: 'your-secret-key-change-this-in-production', // В продакшені використовуйте змінну середовища
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // В продакшені з HTTPS встановити true
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 години
  }
}))

// Ініціалізація Passport
app.use(passport.initialize())
app.use(passport.session())

app.use(optionalAuthenticated)
app.use(router)
app.use(errors())

app.use((req, res) => {
  const theme = req.cookies.user_theme || 'light'
  res.status(404).render('404', {
    title: 'Сторінка не знайдена',
    user: req.user,
    theme: theme
  })
})

app.use((err, req, res, next) => {
  res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})