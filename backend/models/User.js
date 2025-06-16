const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        bio: { type: String },
        profilePicture: { type: String }
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    education: {
        institution: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        graduationYear: { type: Number },
        currentYear: { type: Number }
    },
    subjects: {
        teaching: [{ type: String }],
        learning: [{ type: String }]
    },
    availability: {
        preferredDays: [{ type: String }],
        preferredTimes: [{ type: String }],
        timezone: { type: String }
    },
    preferences: {
        teachingMethod: { type: String, enum: ['online', 'in-person', 'hybrid'], default: 'online' },
        learningMethod: { type: String, enum: ['online', 'in-person', 'hybrid'], default: 'online' },
        maxStudentsPerSession: { type: Number, default: 1 },
        preferredSessionDuration: { type: Number, default: 60 }
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
