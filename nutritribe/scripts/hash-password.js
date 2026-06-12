// Usage: node scripts/hash-password.js yourpassword
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('\nYour bcrypt hash (paste this as ADMIN_PASSWORD_HASH in .env.local):\n');
  console.log(hash);
  console.log();
});
