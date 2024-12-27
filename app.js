const express = require('express');
const mongoose = require('mongoose');
const BinarySearchTree = require('./bst');
const Student = require('./studentModel');
const fs = require('fs');


const app = express();
const bst = new BinarySearchTree();


mongoose.connect('mongodb+srv://abhijnarao11:abhi1128@cluster0.dmdrozp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});


app.use(express.json());


function logToFile(message) {
    const logFilePath = 'student_log.txt'; 
    
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        } else {
            console.log('Data logged successfully');
        }
    });
}



app.post('/students', async (req, res) => {
    try {
        const { name, id, score } = req.body;
        
        if (!name || !id || !score) {
            return res.status(400).json({ message: 'Missing required fields (name, id, score)' });
        }
        
       
        const existingStudent = await Student.findOne({ id });
        if (existingStudent) {
            return res.status(400).json({ message: `Student with ID ${id} already exists` });
        }

      
        const newStudent = new Student({ name, id, score });
        await newStudent.save();

        
        const logMessage = `New student added: ID = ${id}, Name = ${name}, Score = ${score}`;
        logToFile(logMessage);  
        
        res.status(201).json(newStudent);  
    } catch (err) {
        res.status(500).json({ message: 'Error adding student', error: err });
    }
});




app.get('/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ score: -1 }); 
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err });
    }
});


app.get('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findOne({ id: studentId });
        if (!student) {
            return res.status(404).json({ message: `Student with ID ${studentId} not found` });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving student', error: err });
    }
});


app.get('/students/rank', async (req, res) => {
    try {
        const students = await Student.find().sort({ score: -1 });
        students.forEach(student => bst.insert(student)); 
        const rankedStudents = bst.inorder(bst.root); 
        res.json(rankedStudents);
    } catch (err) {
        res.status(500).json({ message: 'Error processing students for rank', error: err });
    }
});


app.post('/students', async (req, res) => {
    try {
        const { name, id, score } = req.body;
        if (!name || !id || !score) {
            return res.status(400).json({ message: 'Missing required fields (name, id, score)' });
        }

        const newStudent = new Student({ name, id, score });
        await newStudent.save();
        res.status(201).json(newStudent);  
    } catch (err) {
        res.status(500).json({ message: 'Error adding student', error: err });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
