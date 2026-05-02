const axios = require('axios');

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Получить обложку книги по ISBN из Google Books API
 * @param {string} isbn - ISBN книги
 * @returns {Promise<string|null>} - URL обложки или null
 */
async function getBookCoverByISBN(isbn) {
  try {
    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: `isbn:${isbn}`,
        fields: 'items(volumeInfo(imageLinks(thumbnail)))',
        key: process.env.GOOGLE_BOOKS_API_KEY || ''
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const volumeInfo = response.data.items[0].volumeInfo;
      if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
        // Заменяем http на https и увеличиваем размер
        return volumeInfo.imageLinks.thumbnail
          .replace('http:', 'https:')
          .replace('&zoom=1', '&zoom=2');
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching book cover from Google Books:', error.message);
    return null;
  }
}

/**
 * Получить информацию о книге по ISBN
 * @param {string} isbn - ISBN книги
 * @returns {Promise<Object|null>} - Информация о книге или null
 */
async function getBookInfoByISBN(isbn) {
  try {
    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: `isbn:${isbn}`,
        key: process.env.GOOGLE_BOOKS_API_KEY || ''
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const volumeInfo = response.data.items[0].volumeInfo;
      return {
        title: volumeInfo.title,
        description: volumeInfo.description,
        publisher: volumeInfo.publisher,
        publicationYear: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.substring(0, 4)) : null,
        coverImage: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:')?.replace('&zoom=1', '&zoom=2') || null,
        pageCount: volumeInfo.pageCount,
        language: volumeInfo.language
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching book info from Google Books:', error.message);
    return null;
  }
}

module.exports = {
  getBookCoverByISBN,
  getBookInfoByISBN
};
