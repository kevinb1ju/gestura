const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Institution = require('../models/Institution');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin',
    email: 'admin@gestura.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Teacher John',
    email: 'teacher@gestura.com',
    password: 'teacher123',
    role: 'teacher',
    institution: 'Sunshine Academy',
  },
  {
    name: 'Lily Student',
    email: 'lily@gestura.com',
    password: 'student123',
    role: 'student',
    institution: 'Sunshine Academy',
  },
  {
    name: 'Parent Mary',
    email: 'parent@gestura.com',
    password: 'parent123',
    role: 'parent',
    institution: 'Sunshine Academy',
  },
];

const institutions = [
  { name: 'Sunshine Academy', status: 'Active' },
  { name: 'Bright Minds School', status: 'Active' },
  { name: 'Hopeful Hearts Center', status: 'Pending' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing data...');
    await User.deleteMany();
    await Institution.deleteMany();

    console.log('🏫 Creating institutions...');
    await Institution.insertMany(institutions);

    console.log('👥 Creating users...');
    for (const userData of users) {
      await User.create(userData);
    }

    console.log('\n═══════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════');
    console.log('\n📝 Test Accounts:');
    console.log('\n👑 ADMIN:');
    console.log('   Email: admin@gestura.com');
    console.log('   Password: admin123');
    console.log('\n👨‍🏫 TEACHER:');
    console.log('   Email: teacher@gestura.com');
    console.log('   Password: teacher123');
    console.log('\n👧 STUDENT:');
    console.log('   Email: lily@gestura.com');
    console.log('   Password: student123');
    console.log('\n👨‍👩‍👧 PARENT:');
    console.log('   Email: parent@gestura.com');
    console.log('   Password: parent123');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
