/**
 * Админ қолданушысын жасайды (әлі жоқ болса).
 * Іске қосу: node src/scripts/create-admin.js
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@lms.kz' },
      defaults: {
        email: 'admin@lms.kz',
        password: 'admin123',
        firstName: 'Админ',
        lastName: 'Әкімші',
        role: 'admin'
      }
    });
    if (created) {
      console.log('Админ қосылды: admin@lms.kz / admin123');
    } else {
      if (user.role !== 'admin') {
        await user.update({ role: 'admin' });
        console.log('Қолданушы admin рөліне өзгертілді: admin@lms.kz');
      } else {
        console.log('Админ әлі бар: admin@lms.kz');
      }
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

createAdmin();
