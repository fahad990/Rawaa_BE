'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrderSchema = new _mongoose.Schema({
    cartons: [{
        type: Number,
        ref: 'carton'
    }],
    cartonsQuantity: [{
        type: Number
    }],
    galons: [{
        type: Number,
        ref: "galon"
    }],
    galonsQuantityOfBuying: [{
        type: Number
    }],
    galonsQuantityOfSubstitution: [{
        type: Number
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
        default: "pendding"
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

OrderSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
OrderSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'order',
    startAt: 1
});

exports.default = _mongoose2.default.model("order", OrderSchema);
//# sourceMappingURL=order.model.js.map