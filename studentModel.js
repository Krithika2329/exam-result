// studentModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
