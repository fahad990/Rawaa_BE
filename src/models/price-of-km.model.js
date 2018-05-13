import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const PriceSchema = new Schema({
    price: {
        type: Number,
        required: true
    }
})

PriceSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
PriceSchema.plugin(autoIncrement.plugin, {
    model: 'price-km',
    startAt: 1,
});

export default mongoose.model("price-km", PriceSchema); 