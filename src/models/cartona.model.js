import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const CartonSchema = new Schema({
    img: {
        type: String,
        required: true
    },
    numberOfBottles: {
        type: Number,
        default: 1,
        required: true
    },
    sizeOfBottles: {
        type: Number,
        required: true
    },
    typeOfSize: {
        type: String,
        enum: ['liter', 'Millimeter'],
        default: 'liter'
    },
    price: {
        type: Number,
        required: true
    },
    typeOfOrder: {
        type: String,
        enum: ['buying', 'substitution'],
        default: 'buying'
    },
    minimumNumberOnOrder: {
        type: Number,
        default: 3,
    },
    user: {
        type: Number,
        ref: "user"
    },
    available: {
        type: Boolean,
        default: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

CartonSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
CartonSchema.plugin(autoIncrement.plugin, {
    model: 'carton',
    startAt: 1,
});

export default mongoose.model("carton", CartonSchema); 