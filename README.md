# Express.js + Passport.js Authentication Project

## Опис проекту

Це проект, який демонструє **повну інтеграцію Passport.js** з Express.js для створення системи аутентифікації користувачів. Основна мета проекту - показати, як правильно налаштувати та використовувати Passport.js з LocalStrategy для авторизації через email та пароль, інтегровану з Express Sessions.

## Цілі проекту

### Основна ціль
Реалізувати **безпечну систему аутентифікації** використовуючи:
- **Passport.js** з LocalStrategy
- **Express Sessions** для зберігання стану авторизації
- **bcrypt** для хешування паролів
- **httpOnly cookies** для безпеки

### Технічні цілі
- ✅ Налаштування Passport.js конфігурації
- ✅ Створення middleware для захисту маршрутів
- ✅ Реалізація повного циклу: реєстрація → вхід → захищені сторінки → вихід
- ✅ Демонстрація серіалізації/десеріалізації користувачів
- ✅ Інтеграція з Express Sessions та cookies

## Структура проекту

```
src/
├── app.mjs                 # Головний файл додатку з налаштуваннями сесій
├── config/
│   └── passport.mjs        # PASSPORT КОНФІГУРАЦІЯ
├── controllers/
│   ├── auth.mjs           # Контролери аутентифікації
│   └── protected.mjs      # Контролер захищеної сторінки
├── middleware/
│   ├── passport.mjs       # Passport middleware (ensureAuthenticated, etc.)
│   └── index.mjs          # Експорт всіх middleware
├── routes/
│   ├── auth.mjs           # Маршрути аутентифікації
│   ├── protected.mjs      # Захищені маршрути
│   └── index.mjs          # Основний роутер
└── views/
    └── auth/              # Шаблони форм аутентифікації
        ├── login.pug
        ├── register.pug
        └── profile.pug
```

## Passport.js Інтеграція

### 1. Конфігурація Passport (`src/config/passport.mjs`)

```javascript
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

// LocalStrategy з використанням email замість username
passport.use(new LocalStrategy({
  usernameField: 'email',    // Використовуємо email для входу
  passwordField: 'password'
}, async (email, password, done) => {
  // Пошук користувача та перевірка пароля з bcrypt
  const isValidPassword = await bcrypt.compare(password, user.password)
  return done(null, isValidPassword ? user : false)
}))

// Серіалізація - зберігання ID в сесії
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Десеріалізація - отримання повних даних користувача
passport.deserializeUser((id, done) => {
  const user = findUserById(id)
  done(null, user)
})
```

### 2. Налаштування сесій (`src/app.mjs`)

```javascript
import session from 'express-session'
import passport from './config/passport.mjs'

// Express Sessions
app.use(session({
  secret: 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,      // В продакшені: true (HTTPS)
    httpOnly: true,     // Захист від XSS
    maxAge: 24 * 60 * 60 * 1000  // 24 години
  }
}))

// Ініціалізація Passport
app.use(passport.initialize())  // Запуск Passport
app.use(passport.session())     // Інтеграція з сесіями
```

### 3. Middleware захисту (`src/middleware/passport.mjs`)

```javascript
// Обов'язкова авторизація
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {  // Passport метод
    return next()
  }
  
  req.session.returnTo = req.originalUrl  // Збереження URL для переадресації
  res.redirect('/auth/login')
}

// Тільки для неавторизованих
export const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/auth/profile')
  }
  next()
}

// Опціональна авторизація
export const optionalAuthenticated = (req, res, next) => {
  // req.user автоматично доступний якщо авторизований
  next()
}
```

## Функції аутентифікації

### 1. Реєстрація користувача

```javascript
export const register = async (req, res) => {
  const { username, email, password } = req.body
  
  // Хешування пароля з bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Створення користувача
  const newUser = await addUser({ username, email, password: hashedPassword })
  
  // Автоматичний вхід після реєстрації
  req.logIn(newUser, (err) => {
    if (err) return next(err)
    res.redirect('/')
  })
}
```

### 2. Авторизація користувача

```javascript
export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      return res.render('auth/login', { error: info.message })
    }
    
    // Створення сесії
    req.logIn(user, (err) => {
      if (err) return next(err)
      
      // Переадресація на збережену сторінку
      const returnTo = req.session.returnTo || '/'
      delete req.session.returnTo
      res.redirect(returnTo)
    })
  })(req, res, next)
}
```

### 3. Вихід з системи

```javascript
export const logout = (req, res, next) => {
  req.logout((err) => {  // Passport метод
    if (err) return next(err)
    
    req.session.destroy((err) => {  // Знищення сесії
      if (err) return next(err)
      res.clearCookie('connect.sid')  // Очищення cookie
      res.redirect('/')
    })
  })
}
```

## Захищені маршрути

### Основний захищений маршрут (`/protected`)

```javascript
// src/routes/protected.mjs
import { ensureAuthenticated } from '../middleware/passport.mjs'

router.get('/', ensureAuthenticated, getProtectedPage)
```

### Використання в контролері

```javascript
export const getProtectedPage = (req, res) => {
  // req.user автоматично доступний завдяки Passport
  res.render('protected', {
    title: 'Захищена сторінка',
    user: req.user  // Дані авторизованого користувача
  })
}
```

## Безпека

### Паролі
- **bcrypt хешування** з saltRounds = 10
- **Мінімум 6 символів** при реєстрації
- **Порівняння хешів** через `bcrypt.compare()`

### Сесії та Cookies
- **httpOnly: true** - захист від XSS атак
- **secure: false** (для розробки) - в продакшені true для HTTPS
- **Унікальний session secret** - для підпису cookies
- **maxAge: 24 години** - автоматичне закінчення сесії

### Валідація
- **Joi + Celebrate** - серверна валідація форм
- **HTML5 валідація** - клієнтська валідація
- **Унікальність email** - перевірка при реєстрації

## Тестові акаунти

```javascript
// Адміністратор
Email: admin@example.com
Пароль: password123

// Звичайний користувач  
Email: user1@example.com
Пароль: password123
```

## 📋 Маршрути ��утентифікації

| Метод | Маршрут | Опис | Middleware |
|-------|---------|------|------------|
| `GET` | `/auth/login` | Сторінка входу | `ensureGuest` |
| `POST` | `/auth/login` | Обробка входу | `ensureGuest` |
| `GET` | `/auth/register` | Сторінка реєстрації | `ensureGuest` |
| `POST` | `/auth/register` | Обробка реєстрації | `ensureGuest` |
| `POST` | `/auth/logout` | Вихід з системи | - |
| `GET` | `/auth/profile` | Профіль користувача | `ensureAuthenticated` |
| `GET` | `/protected` | **Захищена сторінка** | `ensureAuthenticated` |

## Запуск проекту

```bash
# Встановлення залежностей
npm install

# Запуск у режимі розробки
npm run dev

```

Перейдіть на http://localhost:3000 та спробуйте:
1. **Реєстрацію нового користувача**
2. **Вхід з тестовими акаунтами**
3. **Доступ до захищеної сторінки** `/protected`
4. **Вихід з системи**

## Технології

### Основні
- **Node.js** - серверне середовище
- **Express.js 5.1.0** - веб-фреймворк
- **Passport.js** - аутентифікація
- **passport-local** - локальна стратегія

### Безпека
- **bcrypt** - хешування паролів
- **express-session** - управління сесіями
- **cookie-parser** - обробка cookies
- **Joi + Celebrate** - валідація даних

### Шаблони та стилі
- **PUG** - основний шаблонізатор
- **EJS** - для статей
- **CSS3** - власні стилі з темною темою

## Особливості Passport.js у проекті

### Автоматичні можливості
- `req.isAuthenticated()` - перевірка авторизації
- `req.user` - дані поточного користувача
- `req.logIn()` / `req.logout()` - управління сесіями
- Автоматична серіалізація/десеріалізація

### Переваги LocalStrategy
- **Простота налаштування** - мінімальна конфігурація
- **Гнучкість** - можна використовувати email замість username
- **Безпека** - інтеграція з bcrypt

## Висновок

Цей проект демонструє **повну інтеграцію Passport.js** з Express.js, показуючи:

- ✅ Правильне налаштування LocalStrategy
- ✅ Безпечне зберігання паролів з bcrypt
- ✅ Ефективне управління сесіями
- ✅ Захист маршрутів через middleware
- ✅ Повний цикл аутентифікації користувача