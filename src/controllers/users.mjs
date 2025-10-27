const users = [
  { id: 1, name: 'Олександр Петров', email: 'oleksandr@example.com', age: 25, city: 'Київ' },
  { id: 2, name: 'Марія Іванова', email: 'maria@example.com', age: 30, city: 'Львів' },
  { id: 3, name: 'Дмитро Коваленко', email: 'dmytro@example.com', age: 28, city: 'Одеса' },
  { id: 4, name: 'Анна Шевченко', email: 'anna@example.com', age: 22, city: 'Харків' }
]

const getUserHandler = (req, res) => {
  const theme = req.cookies.user_theme || 'light'
  res.render('users/index', { 
    users, 
    title: 'Список користувачів',
    user: req.user,
    theme: theme
  })
}

const postUserHandler = (req, res) => {
  res.status(201).end('Post users route')
}

const getUserByIdHandler = (req, res) => {
  const { userId } = req.params
  const theme = req.cookies.user_theme || 'light'
  const user = users.find(u => u.id === parseInt(userId))
  
  if (!user) {
    return res.status(404).render('users/not-found', { 
      title: 'Користувач не знайдений',
      user: req.user,
      theme: theme
    })
  }
  
  res.render('users/detail', { 
    userDetail: user, 
    title: `Користувач: ${user.name}`,
    user: req.user,
    theme: theme
  })
}

const deleteUserByIdHandler = (req, res) => {
  const { userId } = req.params
  res.status(204).end()
}

const putUserByIdHandler = (req, res) => {
  const { userId } = req.params
  res.end(`Put user by id route: ${userId}`)
}

const patchUserByIdHandler = (req, res) => {
  const { userId } = req.params
  res.end(`Patch user by id route: ${userId}`)
}

export {
  getUserHandler,
  postUserHandler,
  getUserByIdHandler,
  deleteUserByIdHandler,
  putUserByIdHandler,
  patchUserByIdHandler
}