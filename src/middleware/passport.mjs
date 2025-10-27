// Middleware для перевірки авторизації через Passport
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  
  // Якщо це API запит, повертаємо JSON
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Для доступу до цього ресурсу потрібна авторизація' 
    })
  }
  
  // Для звичайних запитів перенаправляємо на сторінку входу
  req.session.returnTo = req.originalUrl
  res.redirect('/auth/login')
}

// Middleware для перевірки що користувач не авторизований
export const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/auth/profile')
  }
  next()
}

// Middleware для необов'язкової авторизації (не блокує доступ)
export const optionalAuthenticated = (req, res, next) => {
  // Passport автоматично додає req.user якщо користувач авторизований
  next()
}

