// Контролер для захищеного маршруту
export const getProtectedPage = (req, res) => {
  const theme = req.cookies.user_theme || 'light'
  res.render('protected', {
    title: 'Захищена сторінка',
    user: req.user,
    theme: theme
  })
}