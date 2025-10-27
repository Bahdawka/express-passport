import passport from 'passport'
import { addUser, getUserByEmail } from '../config/passport.mjs'

export const getLoginPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }

  const theme = req.cookies.user_theme || 'light'
  res.render('auth/login', {
    title: 'Вхід до системи',
    error: req.session.messages ? req.session.messages[req.session.messages.length - 1] : null,
    theme: theme
  })
}

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const theme = req.cookies.user_theme || 'light'
    
    if (err) {
      return res.render('auth/login', {
        title: 'Вхід до системи',
        error: 'Помилка сервера',
        theme: theme
      })
    }

    if (!user) {
      return res.render('auth/login', {
        title: 'Вхід до системи',
        error: info.message || 'Невірні дані для входу',
        theme: theme
      })
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.render('auth/login', {
          title: 'Вхід до системи',
          error: 'Помилка створення сесії',
          theme: theme
        })
      }

      const returnTo = req.session.returnTo || '/'
      delete req.session.returnTo
      res.redirect(returnTo)
    })
  })(req, res, next)
}

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err)
      }
      res.clearCookie('connect.sid')
      res.redirect('/')
    })
  })
}

export const getProfile = (req, res) => {
  const theme = req.cookies.user_theme || 'light'
  res.render('auth/profile', {
    title: 'Профіль користувача',
    user: req.user,
    theme: theme
  })
}

// Контролер для сторінки реєстрації
export const getRegisterPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }

  const theme = req.cookies.user_theme || 'light'
  res.render('auth/register', {
    title: 'Реєстрація',
    error: null,
    theme: theme
  })
}

// Контролер для обробки реєстрації
export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body
    const theme = req.cookies.user_theme || 'light'

    // Валідація
    if (!username || !email || !password || !confirmPassword) {
      return res.render('auth/register', {
        title: 'Реєстрація',
        error: 'Всі поля обов\'язкові для заповнення',
        theme: theme
      })
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', {
        title: 'Реєстрація',
        error: 'Паролі не співпадають',
        theme: theme
      })
    }

    if (password.length < 6) {
      return res.render('auth/register', {
        title: 'Реєстрація',
        error: 'Пароль повинен містити мінімум 6 символів',
        theme: theme
      })
    }

    // Перевіряємо чи користувач вже існує
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Реєстрація',
        error: 'Користувач з таким email вже існує',
        theme: theme
      })
    }

    // Створюємо нового користувача
    const newUser = await addUser({ username, email, password })

    // Автоматично авторизуємо користувача після реєстрації
    req.logIn(newUser, (err) => {
      if (err) {
        return res.render('auth/register', {
          title: 'Реєстрація',
          error: 'Користувач створений, але виникла помилка автоматичного входу. Спробуйте увійти вручну.',
          theme: theme
        })
      }
      res.redirect('/')
    })

  } catch (error) {
    const theme = req.cookies.user_theme || 'light'
    res.render('auth/register', {
      title: 'Реєстрація',
      error: error.message || 'Помилка сервера',
      theme: theme
    })
  }
}