'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PriceSchema = new _mongoose.Schema({
    price: {
        type: Number,
        required: true
    }
});

PriceSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
PriceSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'price-km',
    startAt: 1
});

exports.default = _mongoose2.default.model("price-km", PriceSchema);
//# sourceMappingURL=price-of-km.model.js.map