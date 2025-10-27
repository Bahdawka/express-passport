const getRootHandler = (req, res) => {
  const theme = req.cookies.user_theme || 'light'
  
  res.render('index', { 
    title: 'Ласкаво просимо до Express App!',
    description: 'Додаток демонструє використання PUG та EJS шаблонізаторів',
    user: req.user || null,
    theme: theme
  })
}

export { getRootHandler }