const articles = [
  {
    id: 1,
    title: 'Вступ до Node.js',
    content: 'Node.js - це потужна платформа для розробки серверних додатків на JavaScript...',
    author: 'Олександр Петров',
    publishDate: '2024-01-15',
    category: 'Веб-розробка',
    tags: ['Node.js', 'JavaScript', 'Backend']
  },
  {
    id: 2,
    title: 'Express.js Framework',
    content: 'Express.js є найпопулярнішим веб-фреймворком для Node.js...',
    author: 'Марія Іванова',
    publishDate: '2024-02-20',
    category: 'Backend',
    tags: ['Express.js', 'Node.js', 'Framework']
  },
  {
    id: 3,
    title: 'Робота з базами даних',
    content: 'MongoDB та PostgreSQL - найпопулярніші варіанти для веб-додатків...',
    author: 'Дмитро Коваленко',
    publishDate: '2024-03-10',
    category: 'Бази даних',
    tags: ['MongoDB', 'PostgreSQL', 'Database']
  }
]

const getArticlesHandler = (req, res) => {
  const theme = req.cookies.user_theme || 'light'
  res.render('articles/index.ejs', { 
    articles, 
    title: 'Список статей',
    user: req.user || null,
    theme: theme
  })
}

const postArticlesHandler = (req, res) => {
  res.status(201).end('Create article')
}

const getArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  const theme = req.cookies.user_theme || 'light'
  const article = articles.find(a => a.id === parseInt(articleId))
  
  if (!article) {
    return res.status(404).render('articles/not-found.ejs', { 
      title: 'Стаття не знайдена',
      user: req.user || null,
      theme: theme
    })
  }
  
  res.render('articles/detail.ejs', { 
    article, 
    title: article.title,
    user: req.user || null,
    theme: theme
  })
}

const deleteArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  res.status(204).end()
}

const putArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  res.end(`Update article by ID: ${articleId}`)
}

const patchArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  res.end(`Partially update article by ID: ${articleId}`)
}

export {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  deleteArticleByIdHandler,
  putArticleByIdHandler,
  patchArticleByIdHandler
}