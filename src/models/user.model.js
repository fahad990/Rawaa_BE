import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import autoIncrement from 'mongoose-auto-increment';

const UserSchema = new Schema({
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
        default: new Date
    },
    company: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    pushTokens: [{
        type: String
    }]

});



UserSchema.pre("save", function (next) {
    const account = this;
    if (!account.isModified('password')) return next();

    const salt = bcrypt.genSaltSync();
    bcrypt.hash(account.password, salt).then(hash => {
        account.password = hash;
        next();
    }).catch(err => console.log(err));
});




UserSchema.methods.isValidPassword = function (newPassword, callback) {
    let user = this;
    bcrypt.compare(newPassword, user.password, function (err, isMatch) {
        if (err)
            return callback(err);
        callback(null, isMatch);
    })
};


UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;

        delete ret.password;
        delete ret.pushTokens;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    startAt: 1,
});

export default mongoose.model("user", UserSchema);