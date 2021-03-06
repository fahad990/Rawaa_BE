'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageSchema = new _mongoose.Schema({
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
});

MessageSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
MessageSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'message',
    startAt: 1
});

exports.default = _mongoose2.default.model("message", MessageSchema);
//# sourceMappingURL=message-admin.model.js.map