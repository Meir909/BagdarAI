const bcrypt = require('bcryptjs');

// Тестовые данные
const testPassword = 'Admin@BagdarAI2024';
const storedHash = '$2b$10$bXGjxHRkBRTksnkVytvH3OPplhvu1xfuHbuW9Jkc6B6t8GBF/w/j.';

async function testHash() {
  console.log('=== Тестирование bcrypt ===');
  console.log('Пароль:', testPassword);
  console.log('Хэш из базы:', storedHash);
  console.log('Длина хэша:', storedHash.length);
  
  // Проверяем пароль
  const isValid = await bcrypt.compare(testPassword, storedHash);
  console.log('Результат проверки:', isValid);
  
  // Проверяем, что хэш правильный
  const testHash = await bcrypt.hash(testPassword, 10);
  console.log('Новый хэш:', testHash);
  console.log('Хэши совпадают:', storedHash === testHash);
}

testHash().catch(console.error);
