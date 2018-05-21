"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _mongooseAutoIncrement = require("mongoose-auto-increment");

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        enum: ["ADMIN", "NORMAL", "PROVIDER"],
        default: "NORMAL"
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "Duplicated Phone"]
    },
    img: { // url 
        type: String,
        default: "https://cdn1.iconfinder.com/data/icons/people-cultures/512/_saudi_arabian_man-512.png"
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    company: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    email: {
        type: String

    },
    pushTokens: [{
        type: String
    }],
    code: {
        type: String
    }

});

UserSchema.pre("save", function (next) {
    var account = this;
    if (!account.isModified('password')) return next();

    var salt = _bcryptjs2.default.genSaltSync();
    _bcryptjs2.default.hash(account.password, salt).then(function (hash) {
        account.password = hash;
        next();
    }).catch(function (err) {
        return console.log(err);
    });
});

UserSchema.methods.isValidPassword = function (newPassword, callback) {
    var user = this;
    _bcryptjs2.default.compare(newPassword, user.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;

        delete ret.password;
        delete ret.pushTokens;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
UserSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'user',
    startAt: 1
});

exports.default = _mongoose2.default.model("user", UserSchema);
//# sourceMappingURL=user.model.js.map