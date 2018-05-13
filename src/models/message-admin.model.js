import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    targetUser: {
        type: Number,
        ref: 'user',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

MessageSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
MessageSchema.plugin(autoIncrement.plugin, {
    model: 'message',
    startAt: 1,
});

export default mongoose.model("message", MessageSchema); 