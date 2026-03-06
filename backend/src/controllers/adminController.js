const { User, Book, Author, Borrowing } = require('../models');

exports.getStats = async (req, res, next) => {
  try {
    const [usersCount, booksCount, authorsCount, borrowingsCount] = await Promise.all([
      User.count(),
      Book.count(),
      Author.count(),
      Borrowing.count()
    ]);

    const activeBorrowings = await Borrowing.count({
      where: { status: 'borrowed' }
    });

    res.json({
      success: true,
      data: {
        users: usersCount,
        books: booksCount,
        authors: authorsCount,
        borrowings: borrowingsCount,
        activeBorrowings
      }
    });
  } catch (error) {
    next(error);
  }
};
