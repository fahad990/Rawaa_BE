'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CartonSchema = new _mongoose.Schema({
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
        default: 3
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
});

CartonSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
CartonSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'carton',
    startAt: 1
});

exports.default = _mongoose2.default.model("carton", CartonSchema);
//# sourceMappingURL=cartona.model.js.map