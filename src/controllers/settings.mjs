export const getSettingsPage = (req, res) => {
  const currentTheme = req.cookies.user_theme || 'light'
  
  res.render('settings/index', { 
    title: 'Налаштування',
    user: req.user,
    currentTheme,
    theme: currentTheme
  })
}

export const setTheme = (req, res) => {
  const theme = req.body.theme
  
  if (!theme || !['light', 'dark'].includes(theme)) {
    return res.redirect('/settings')
  }
  
  res.cookie('user_theme', theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    secure: process.env.NODE_ENV === 'production'
  })
  
  res.redirect('/settings')
}