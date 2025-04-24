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
            required: true,
        },
        long: {
            type: Number,
            required: true,
        },
    },
    rating: {
        positive: {
            type: Number,
            default: 0,
            required: true,
        },
        negative: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
