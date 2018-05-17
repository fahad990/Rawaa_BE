import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const OrderSchema = new Schema({
    cartons: [{
        type: Number,
        ref: 'carton',
    }],
    cartonsQuantity: [{
        type: Number,
    }],
    galons: [{
        type: Number,
        ref: "galon",
    }],
    galonsQuantityOfBuying: [{
        type: Number,
    }],
    galonsQuantityOfSubstitution: [{
        type: Number,
    }],
    price: {
        type: Number,
        required: true
    },
    deliveryPrice: {
        type: Number,
        required: true
    },
    //location of deliver
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
    },
    customer: {
        type: Number,
        ref: "user"
    },
    provider: {
        type: Number,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["pendding", "accepted", "rejected", "onTheWay", "delivered"],
        default: "pendding",
    },
    note: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

OrderSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
OrderSchema.plugin(autoIncrement.plugin, {
    model: 'order',
    startAt: 1,
});

export default mongoose.model("order", OrderSchema); 