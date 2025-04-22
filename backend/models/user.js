const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
firstName: {
    type: String,
    required: true,
    trim: true
},
lastName: {
    type: String,
    required: true,
    trim: true
},
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
},
phone: {
    type: String,
    required: true
},
dob: {
    type: Date,
    required: true
},
address: {
    type: String,
    required: true
},
gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
},
password: {
    type: String,
    required: true
},
role: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin'],
    default: 'Patient'
},

specialization: { 
    type: String,
    enum: [
        "Cardiology", 
        "Neurology", 
        "Orthopedics", 
        "Pediatrics", 
        "General Surgery", 
        "Dermatology", 
        "Radiology", 
        "Dentistry", 
        "Psychiatry", 
        "Gynecology", 
        "Anesthesiology"
    ],
    required: function() { return this.role === 'Doctor'; }  // Only required for Doctors
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
