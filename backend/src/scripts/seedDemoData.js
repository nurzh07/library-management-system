// Демо деректерді толтыру скрипті
const { Book, Author, Category, User } = require('../models');

const demoData = {
  categories: [
    { name: 'Қазақ әдебиеті', description: 'Қазақ жазушыларының шығармалары' },
    { name: 'Дүниежүзілік классика', description: 'Әлемдік әдебиет шедеврлары' },
    { name: 'Ғылыми әдебиет', description: 'Ғылыми зерттеулер мен монографиялар' },
    { name: 'Балалар әдебиеті', description: 'Балалар мен жасөспірімдерге арналған' },
    { name: 'Тарих', description: 'Тарихи зерттеулер мен шығармалар' }
  ],
  
  authors: [
    { firstName: 'Мұхтар', lastName: 'Ауезов', nationality: 'Қазақ', biography: 'Қазақ әдебиетінің классигі, «Абай жолы» эпопеясының авторы' },
    { firstName: 'Абай', lastName: 'Құнанбаев', nationality: 'Қазақ', biography: 'Қазақтың ұлы ақыны, философы және композиторы' },
    { firstName: 'Сәкен', lastName: 'Сейфуллин', nationality: 'Қазақ', biography: 'Қазақ совет жазушысы, қазақ әдебиетінің негізін салушы' },
    { firstName: 'Федор', lastName: 'Достоевский', nationality: 'Ресей', biography: 'Рус әдебиетінің ұлы классигі' },
    { firstName: 'Лев', lastName: 'Толстой', nationality: 'Ресей', biography: 'Әлемдік әдебиеттің шедеврлерінің авторы' },
    { firstName: 'Габриель', lastName: 'Гарсиа Маркес', nationality: 'Колумбия', biography: 'Нобель сыйлығының лауреаты, магиялық реализм шебері' }
  ],
  
  books: [
    { title: 'Абай жолы', isbn: '978-601-7474-01-1', totalCopies: 10, availableCopies: 8, authorIndices: [0, 1], categoryIndex: 0 },
    { title: 'Қара сөздер', isbn: '978-601-7474-02-8', totalCopies: 15, availableCopies: 12, authorIndices: [1], categoryIndex: 0 },
    { title: 'Алдар Көсе', isbn: '978-601-7474-03-5', totalCopies: 20, availableCopies: 18, authorIndices: [2], categoryIndex: 3 },
    { title: 'Қылмыс және жаза', isbn: '978-601-7474-04-2', totalCopies: 12, availableCopies: 10, authorIndices: [3], categoryIndex: 1 },
    { title: 'Соғыс және бітім', isbn: '978-601-7474-05-9', totalCopies: 8, availableCopies: 5, authorIndices: [4], categoryIndex: 1 },
    { title: 'Жүз жылдық жалғыздық', isbn: '978-601-7474-06-6', totalCopies: 10, availableCopies: 7, authorIndices: [5], categoryIndex: 1 },
    { title: 'Қазақтың көне тарихы', isbn: '978-601-7474-07-3', totalCopies: 6, availableCopies: 6, authorIndices: [], categoryIndex: 4 }
  ]
};

async function seedDemoData() {
  try {
    console.log('🌱 Демо деректерді толтыру басталды...\n');
    
    // Категориялар
    console.log('📚 Категориялар жасалуда...');
    const categories = await Category.bulkCreate(demoData.categories);
    console.log(`   ✅ ${categories.length} категория жасалды`);
    
    // Авторлар
    console.log('✍️ Авторлар жасалуда...');
    const authors = await Author.bulkCreate(demoData.authors);
    console.log(`   ✅ ${authors.length} автор жасалды`);
    
    // Кітаптар
    console.log('📖 Кітаптар жасалуда...');
    for (const bookData of demoData.books) {
      const book = await Book.create({
        title: bookData.title,
        isbn: bookData.isbn,
        totalCopies: bookData.totalCopies,
        availableCopies: bookData.availableCopies,
        categoryId: categories[bookData.categoryIndex]?.id
      });
      
      // Авторларды байланыстыру
      if (bookData.authorIndices.length > 0) {
        const bookAuthors = bookData.authorIndices.map(idx => authors[idx]);
        await book.addAuthors(bookAuthors);
      }
    }
    console.log(`   ✅ ${demoData.books.length} кітап жасалды`);
    
    // Қарапайым қолданушы
    console.log('👤 Демо қолданушы жасалуда...');
    await User.create({
      email: 'user@library.kz',
      password: 'User123!',
      firstName: 'Қарапайым',
      lastName: 'Қолданушы',
      role: 'user'
    });
    console.log('   ✅ Демо қолданушы жасалды');
    
    console.log('\n🎉 Демо деректер сәтті толтырылды!');
    console.log('\n📋 Жүйедегі деректер:');
    console.log('   • Админ: admin@library.kz / Admin123!');
    console.log('   • Қолданушы: user@library.kz / User123!');
    console.log('   • Кітаптар: 7 кітап');
    console.log('   • Авторлар: 6 автор');
    console.log('   • Категориялар: 5 категория');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Қате:', error.message);
    process.exit(1);
  }
}

seedDemoData();
