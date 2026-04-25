// Админ аккаунт жасау скрипті
const { User } = require('../models');

const adminData = {
  email: 'admin@library.kz',
  password: 'Admin123!',
  firstName: 'Супер',
  lastName: 'Админ',
  role: 'admin'
};

async function createAdmin() {
  try {
    // Алдымен бар админ бар ма тексереміз
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    
    if (existingAdmin) {
      console.log('ℹ️  Админ аккаунт бұрыннан бар:');
      console.log('📧 Email:    admin@library.kz');
      console.log('🔑 Пароль:   Admin123!');
      return;
    }
    
    // Жоқ болса, жаңа админ жасаймыз
    const admin = await User.create(adminData);
    
    console.log('✅ Админ аккаунт сәтті жасалды!');
    console.log('');
    console.log('📧 Email:    admin@library.kz');
    console.log('🔑 Пароль:   Admin123!');
    console.log('👤 Рөл:      admin');
    console.log('');
    console.log('🔗 Кіру адресі: http://localhost:3001/login');
    
  } catch (error) {
    console.error('❌ Қате:', error.message);
  }
}

module.exports = { createAdmin };

// Егер негізгі модуль ретінде іске қосылса
if (require.main === module) {
  createAdmin().then(() => process.exit(0));
}
