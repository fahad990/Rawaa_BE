import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const NotificationSchema = new Schema({
    targetUser: {
        type: Number,
        ref: 'user',
        required: true
    },
    order: {
        type: Number,
        ref: 'order',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

NotificationSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
NotificationSchema.plugin(autoIncrement.plugin, {
    model: 'order-notificaton',
    startAt: 1,
});

export default mongoose.model("order-notificaton", NotificationSchema); 