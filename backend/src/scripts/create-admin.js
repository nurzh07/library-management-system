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
      where: { email: 'admin@library.kz' },
      defaults: {
        email: 'admin@library.kz',
        password: 'Admin123!',
        firstName: 'Админ',
        lastName: 'Әкімші',
        role: 'admin'
      }
    });
    if (created) {
      console.log('Админ қосылды: admin@library.kz / Admin123!');
    } else {
      // Update password and role
      await user.update({ password: 'Admin123!', role: 'admin' });
      console.log('Админ жаңартылды: admin@library.kz / Admin123!');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

createAdmin();
