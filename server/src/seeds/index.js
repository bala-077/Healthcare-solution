require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../model/User');
const Post = require('../model/Post');
const Chat = require('../model/Chat');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Dropping existing data...');
    await User.deleteMany();
    await Post.deleteMany();
    await Chat.deleteMany();

    console.log('Inserting sample users...');
    const users = [];
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `User ${i}`,
        occupation: i % 2 === 0 ? 'Doctor' : 'Patient',
        mobileNumber: `+91999999999${i}`,
        firebaseUid: `mock_uid_${i}`,
        profileImage: `https://i.pravatar.cc/150?u=${i}`,
      });
    }

    const createdUsers = await User.insertMany(users);

    console.log('Inserting sample posts...');
    const posts = [];
    for (let i = 0; i < 5; i++) {
      posts.push({
        content: `This is a sample post ${i + 1} from ${createdUsers[i].name}`,
        image: `https://picsum.photos/400/300?random=${i}`,
        author: createdUsers[i]._id,
      });
    }

    await Post.insertMany(posts);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
