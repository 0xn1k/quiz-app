require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Question = require('../models/question');
const User = require('../models/user');

// Sample questions data
const sampleQuestions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    answer: "New Delhi",
    category: "Geography",
    difficulty: "easy",
    isPYQ: false,
    explanation: "New Delhi is the capital of India.",
    tags: ["India", "Capital", "Geography"]
  },
  {
    question: "Who wrote the Indian National Anthem?",
    options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"],
    answer: "Rabindranath Tagore",
    category: "History",
    difficulty: "medium",
    isPYQ: true,
    year: 2023,
    explanation: "Rabindranath Tagore wrote Jana Gana Mana, the Indian National Anthem.",
    tags: ["India", "National Anthem", "History"]
  },
  {
    question: "What is the chemical formula for water?",
    options: ["H2O", "CO2", "O2", "H2O2"],
    answer: "H2O",
    category: "Science",
    difficulty: "easy",
    isPYQ: false,
    explanation: "Water is composed of two hydrogen atoms and one oxygen atom.",
    tags: ["Chemistry", "Water", "Formula"]
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
    category: "Science",
    difficulty: "easy",
    isPYQ: true,
    year: 2022,
    explanation: "Mars appears red due to iron oxide on its surface.",
    tags: ["Astronomy", "Planets", "Mars"]
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean",
    category: "Geography",
    difficulty: "medium",
    isPYQ: false,
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
    tags: ["Ocean", "Geography", "Earth"]
  },
  {
    question: "Who is known as the Father of the Indian Constitution?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "B.R. Ambedkar", "Sardar Patel"],
    answer: "B.R. Ambedkar",
    category: "History",
    difficulty: "medium",
    isPYQ: true,
    year: 2023,
    explanation: "Dr. B.R. Ambedkar is known as the Father of the Indian Constitution.",
    tags: ["India", "Constitution", "History"]
  },
  {
    question: "What is the speed of light in vacuum?",
    options: ["3 × 10^8 m/s", "3 × 10^6 m/s", "3 × 10^10 m/s", "3 × 10^5 m/s"],
    answer: "3 × 10^8 m/s",
    category: "Physics",
    difficulty: "hard",
    isPYQ: true,
    year: 2022,
    explanation: "The speed of light in vacuum is approximately 299,792,458 meters per second.",
    tags: ["Physics", "Light", "Speed"]
  },
  {
    question: "Which programming language is known as the 'mother of all languages'?",
    options: ["C", "Assembly", "FORTRAN", "COBOL"],
    answer: "C",
    category: "Computer Science",
    difficulty: "medium",
    isPYQ: false,
    explanation: "C is often called the mother of all languages due to its influence on many modern languages.",
    tags: ["Programming", "C Language", "Computer Science"]
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    answer: "O(log n)",
    category: "Computer Science",
    difficulty: "hard",
    isPYQ: true,
    year: 2023,
    explanation: "Binary search has a logarithmic time complexity as it divides the search space in half each iteration.",
    tags: ["Algorithms", "Binary Search", "Time Complexity"]
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: "Leonardo da Vinci",
    category: "Arts",
    difficulty: "easy",
    isPYQ: false,
    explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century.",
    tags: ["Art", "Painting", "Renaissance"]
  },
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    answer: "Mitochondria",
    category: "Biology",
    difficulty: "easy",
    isPYQ: true,
    year: 2022,
    explanation: "Mitochondria produce ATP, the energy currency of the cell.",
    tags: ["Biology", "Cell", "Mitochondria"]
  },
  {
    question: "Which Indian state has the longest coastline?",
    options: ["Maharashtra", "Gujarat", "Tamil Nadu", "Andhra Pradesh"],
    answer: "Gujarat",
    category: "Geography",
    difficulty: "hard",
    isPYQ: true,
    year: 2023,
    explanation: "Gujarat has the longest coastline among Indian states, approximately 1,600 km.",
    tags: ["India", "Geography", "Coastline"]
  },
  {
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: "Ampere",
    category: "Physics",
    difficulty: "medium",
    isPYQ: false,
    explanation: "The ampere (A) is the SI unit of electric current.",
    tags: ["Physics", "Electricity", "SI Units"]
  },
  {
    question: "Who discovered penicillin?",
    options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Robert Koch"],
    answer: "Alexander Fleming",
    category: "Science",
    difficulty: "medium",
    isPYQ: true,
    year: 2022,
    explanation: "Alexander Fleming discovered penicillin in 1928.",
    tags: ["Medicine", "Discovery", "Antibiotics"]
  },
  {
    question: "What is the national animal of India?",
    options: ["Lion", "Elephant", "Tiger", "Peacock"],
    answer: "Tiger",
    category: "General Knowledge",
    difficulty: "easy",
    isPYQ: false,
    explanation: "The Bengal Tiger is the national animal of India.",
    tags: ["India", "National Symbol", "Animals"]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing data...');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('Questions cleared');

    console.log('Seeding questions...');
    
    // Insert sample questions
    const questions = await Question.insertMany(sampleQuestions);
    console.log(`${questions.length} questions added successfully`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSummary:');
    console.log(`Total Questions: ${questions.length}`);
    console.log(`PYQs: ${questions.filter(q => q.isPYQ).length}`);
    console.log(`Categories: ${[...new Set(questions.map(q => q.category))].join(', ')}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();