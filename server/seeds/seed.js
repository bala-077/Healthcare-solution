require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../src/model/User');
const Post = require('../src/model/Post');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});

    // 1. Create Users
    console.log('Seeding users...');
    const usersData = [
      {
        name: 'Dr. Sarah Jenkins',
        occupation: 'Cardiologist',
        mobileNumber: '+919999999991',
        firebaseUid: 'seed_uid_1',
        profileImage: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=02B6B6&color=fff',
      },
      {
        name: 'Dr. Rahul Sharma',
        occupation: 'Neurologist',
        mobileNumber: '+919999999992',
        firebaseUid: 'seed_uid_2',
        profileImage: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=02B6B6&color=fff',
      },
      {
        name: 'Emily Chen, RN',
        occupation: 'Registered Nurse',
        mobileNumber: '+919999999993',
        firebaseUid: 'seed_uid_3',
        profileImage: 'https://ui-avatars.com/api/?name=Emily+Chen&background=02B6B6&color=fff',
      },
      {
        name: 'Michael Torres',
        occupation: 'Medical Student',
        mobileNumber: '+919999999994',
        firebaseUid: 'seed_uid_4',
        profileImage: 'https://ui-avatars.com/api/?name=Michael+Torres&background=02B6B6&color=fff',
      },
      {
        name: 'Dr. Anita Patel',
        occupation: 'Pediatrician',
        mobileNumber: '+919999999995',
        firebaseUid: 'seed_uid_5',
        profileImage: 'https://ui-avatars.com/api/?name=Anita+Patel&background=02B6B6&color=fff',
      },
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`Successfully inserted ${createdUsers.length} users!`);

    // Connect all users to each other
    console.log('Connecting all users to each other...');
    for (let i = 0; i < createdUsers.length; i++) {
      const otherUserIds = createdUsers
        .filter((_, index) => index !== i)
        .map(u => u._id);
      
      await User.findByIdAndUpdate(createdUsers[i]._id, {
        $set: { connections: otherUserIds }
      });
    }
    console.log('Successfully connected all users!');

    // 2. Create Posts
    console.log('Seeding posts...');
    const postsData = [
      {
        content: 'Exploring the latest advancements in minimally invasive cardiac surgery. Patient recovery times are reducing significantly. #Cardiology #HealthcareInnovation',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[0]._id, // Dr. Sarah Jenkins
        likes: [createdUsers[1]._id, createdUsers[2]._id],
        shares: 12,
      },
      {
        content: 'A gentle reminder on the importance of annual physical exams. Early detection is key to managing chronic conditions effectively.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[1]._id, // Dr. Rahul Sharma
        likes: [createdUsers[0]._id, createdUsers[3]._id, createdUsers[4]._id],
        shares: 5,
      },
      {
        content: 'Discussing the role of AI in diagnostic imaging. The precision and speed of new algorithms are transforming radiology. #HealthTech #AI',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[2]._id, // Emily Chen
        likes: [createdUsers[0]._id, createdUsers[4]._id],
        shares: 2,
      },
      {
        content: 'Mental health is just as important as physical health. Let\'s work together to break the stigma and encourage open conversations in clinical settings.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[3]._id, // Michael Torres
        likes: [createdUsers[1]._id, createdUsers[2]._id, createdUsers[4]._id],
        shares: 0,
      },
      {
        content: 'Excited to share our team\'s recent publication on pediatric nutrition and long-term metabolic health outcomes. #Pediatrics #Nutrition',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[4]._id, // Dr. Anita Patel
        likes: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id],
        shares: 24,
      },
      {
        content: 'Navigating the complexities of EHR integration. Streamlining workflows can significantly improve patient care and reduce physician burnout.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[0]._id, // Dr. Sarah Jenkins
        likes: [createdUsers[2]._id, createdUsers[4]._id],
        shares: 7,
      },
      {
        content: 'Fascinating seminar today on the gut microbiome\'s impact on systemic immunity. The future of personalized medicine is here. #Microbiome',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[1]._id, // Dr. Rahul Sharma
        likes: [createdUsers[0]._id, createdUsers[3]._id],
        shares: 15,
      },
      {
        content: 'Telemedicine continues to bridge the gap in rural healthcare access. Proud to be part of a team expanding these vital services.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[2]._id, // Emily Chen
        likes: [createdUsers[1]._id, createdUsers[4]._id],
        shares: 8,
      },
      {
        content: 'Reviewing the updated guidelines for managing hypertension in elderly populations. Tailored approaches are yielding better patient compliance.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[3]._id, // Michael Torres
        likes: [createdUsers[0]._id, createdUsers[2]._id],
        shares: 3,
      },
      {
        content: 'The importance of interdisciplinary collaboration in oncology cannot be overstated. A holistic approach leads to the best outcomes for our patients.',
        images: [
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732061/healthcare-app/mx39adbswymeod3oo5db.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732063/healthcare-app/riaajnheslsspegii6n4.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732064/healthcare-app/bhenmznzdkrnmnwbehlt.png",
          "https://res.cloudinary.com/dqxcwi5xo/image/upload/v1784732066/healthcare-app/pslt7kkyerhyc9buqfgq.png"
        ],
        author: createdUsers[4]._id, // Dr. Anita Patel
        likes: [createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id],
        shares: 11,
      }
    ];

    const createdPosts = await Post.insertMany(postsData);
    console.log(`Successfully inserted ${createdPosts.length} posts!`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
