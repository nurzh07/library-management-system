const { sequelize } = require('../config/database');
const { createAdmin } = require('./createAdmin');

async function resetDatabase() {
  try {
    console.log('🔄 Дерекқорды тазалау...');
    
    // Барлық кестелерді өшіру
    await sequelize.drop();
    console.log('✅ Кестелер өшірілді');
    
    // Кестелерді қайта жасау
    await sequelize.sync({ force: true });
    console.log('✅ Кестелер жасалды');
    
    // Админ жасау
    await createAdmin();
    console.log('✅ Админ аккаунт жасалды');
    
    console.log('\n🎉 Дерекқор сәтті тазартылды!');
    console.log('📧 Email: admin@library.kz');
    console.log('🔑 Пароль: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Қате:', error.message);
    process.exit(1);
  }
}

resetDatabase();
