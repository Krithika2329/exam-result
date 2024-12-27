const express = require('express');
const mongoose = require('mongoose');
const BinarySearchTree = require('./bst');
const Student = require('./studentModel');
const fs = require('fs');


const app = express();
const bst = new BinarySearchTree();

// Connect to MongoDB
mongoose.connect('mongodb+srv://abhijnarao11:abhi1128@cluster0.dmdrozp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Middleware to parse JSON
app.use(express.json());

// Helper function to write to a log file
function logToFile(message) {
    const logFilePath = 'student_log.txt'; // Path to the log file

    // Append message to the log file
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        } else {
            console.log('Data logged successfully');
        }
    });
}


// POST endpoint to add a new student
app.post('/students', async (req, res) => {
    try {
        const { name, id, score } = req.body;
        
        if (!name || !id || !score) {
            return res.status(400).json({ message: 'Missing required fields (name, id, score)' });
        }
        
        // Check if student with the given ID already exists
        const existingStudent = await Student.findOne({ id });
        if (existingStudent) {
            return res.status(400).json({ message: `Student with ID ${id} already exists` });
        }

        // Create and save the new student
        const newStudent = new Student({ name, id, score });
        await newStudent.save();

        // Log student data to a text file
        const logMessage = `New student added: ID = ${id}, Name = ${name}, Score = ${score}`;
        logToFile(logMessage);  // Call the helper function to log the data
        
        res.status(201).json(newStudent);  // Respond with the created student
    } catch (err) {
        res.status(500).json({ message: 'Error adding student', error: err });
    }
});



// Endpoint to get all students sorted by score
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ score: -1 }); // Sort students by score (descending)
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err });
    }
});

// Endpoint to search for a student by ID
app.get('/students/search/:id', async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student', error: err });
    }
});

// Endpoint to insert students into BST for rank sorting
app.get('/students/rank', async (req, res) => {
    try {
        const students = await Student.find().sort({ score: -1 });
        students.forEach(student => bst.insert(student)); // Insert students into BST
        const rankedStudents = bst.inorder(bst.root); // Get students sorted by score
        res.json(rankedStudents);
    } catch (err) {
        res.status(500).json({ message: 'Error processing students for rank', error: err });
    }
});

// POST endpoint to add a new student
app.post('/students', async (req, res) => {
    try {
        const { name, id, score } = req.body;
        if (!name || !id || !score) {
            return res.status(400).json({ message: 'Missing required fields (name, id, score)' });
        }

        const newStudent = new Student({ name, id, score });
        await newStudent.save();
        res.status(201).json(newStudent);  // Respond with the created student
    } catch (err) {
        res.status(500).json({ message: 'Error adding student', error: err });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
