import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

// Тестові користувачі 
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$MtszQhA.p2oW77/UPzNQku57X0yb96x686ALPKacsRzR3XpYuXMCC', // bcrypt hash для 'password123'
    role: 'admin'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: '$2b$10$MtszQhA.p2oW77/UPzNQku57X0yb96x686ALPKacsRzR3XpYuXMCC', // bcrypt hash для 'password123'
    role: 'user'
  }
]

// Конфігурація Passport Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Знаходимо користувача по email
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return done(null, false, { message: 'Неправильний email або пароль' })
    }

    // Перевіряємо пароль
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Неправильний email або пароль' })
    }

    // Повертаємо користувача без пароля
    const { password: _, ...userWithoutPassword } = user
    return done(null, userWithoutPassword)
    
  } catch (error) {
    return done(error)
  }
}))

// Серіалізація користувача (зберігання в сесії)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Десеріалізація користувача (отримання з сесії)
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id)
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    done(null, userWithoutPassword)
  } else {
    done(new Error('Користувач не знайдений'), null)
  }
})

// Функція для додавання нового користувача
export const addUser = async (userData) => {
  const { username, email, password, role = 'user' } = userData
  
  // Перевіряємо чи користувач вже існує
  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    throw new Error('Користувач з таким email вже існує')
  }

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Створюємо нового користувача
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password: hashedPassword,
    role
  }

  users.push(newUser)
  
  // Повертаємо користувача без пароля
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Функція для отримання користувача по email
export const getUserByEmail = (email) => {
  return users.find(u => u.email === email)
}

// Функція для отримання всіх користувачів (без паролів)
export const getAllUsers = () => {
  return users.map(({ password, ...user }) => user)
}

export default passport