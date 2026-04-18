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
    // Алғаш бұрынғы admin болса өшіреміз
    await User.destroy({ where: { email: adminData.email } });
    
    // Жаңа админ жасаймыз
    const admin = await User.create(adminData);
    
    console.log('✅ Админ аккаунт сәтті жасалды!');
    console.log('');
    console.log('📧 Email:    admin@library.kz');
    console.log('🔑 Пароль:   Admin123!');
    console.log('👤 Рөл:      admin');
    console.log('');
    console.log('🔗 Кіру адресі: http://localhost:3001/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Қате:', error.message);
    process.exit(1);
  }
}

createAdmin();
