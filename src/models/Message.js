// src/models/Message.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const MessageSchema = new mongoose.Schema({
    message_id: {
        type: String,
        unique: true,
        default: uuidv4, // Automatically generate a UUID when creating a new message
        },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: false,
        },
        long: {
            type: Number,
            required: false,
        },
    },
    rating: {
        positive: {
            type: Number,
            required: false,
        },
        negative: {
            type: Number,
            required: false,
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
