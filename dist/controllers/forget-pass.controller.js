'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _index = require('../utils/index');

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    forgetPassword: function forgetPassword(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var phone, userDetails, email, code, transporter, mailOptions;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            phone = req.body.phone;
                            _context.next = 4;
                            return _user2.default.findOne({ phone: phone });

                        case 4:
                            userDetails = _context.sent;

                            if (userDetails) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(404).end());

                        case 7:
                            email = userDetails.email;

                            //generate code 

                            code = Math.floor(Math.random() * 10000 + 1);

                            userDetails.code = code;
                            _context.next = 12;
                            return userDetails.save();

                        case 12:

                            //send email 
                            transporter = _nodemailer2.default.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'rawaa.app@gmail.com',
                                    pass: 'rawaa123456789'
                                }
                            });
                            mailOptions = {
                                from: 'rawaa.app@gmail.com',
                                to: '' + email,
                                subject: 'Confirmation Code',
                                text: 'Hello Dear, \n                Please use this code  ' + code + '  to reset your password\n                Thanks advanced'
                            };


                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) return console.log(error);
                                return res.status(200).json(info);
                            });
                            _context.next = 20;
                            break;

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 17]]);
        }))();
    },


    //mach code 
    matchCodeOfUserAndResetPass: function matchCodeOfUserAndResetPass(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var code, email, userDetails, userCode;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            if (req.body.code) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(422, 'code is required')));

                        case 3:
                            code = req.body.code;

                            if (req.body.email) {
                                _context2.next = 6;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(422, 'email is required')));

                        case 6:
                            email = req.body.email;

                            if (req.body.newPassword) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(422, 'new password is required')));

                        case 9:
                            console.log(email);
                            _context2.next = 12;
                            return _user2.default.findOne({ email: email });

                        case 12:
                            userDetails = _context2.sent;

                            console.log(userDetails);

                            if (userDetails) {
                                _context2.next = 16;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).end());

                        case 16:
                            userCode = userDetails.code;

                            if (code == userCode) {
                                _context2.next = 19;
                                break;
                            }

                            return _context2.abrupt('return', res.status(400).json({
                                "message": "Invalid code"
                            }));

                        case 19:
                            //change password    
                            userDetails.password = req.body.newPassword;
                            _context2.next = 22;
                            return userDetails.save();

                        case 22:
                            return _context2.abrupt('return', res.status(204).end());

                        case 25:
                            _context2.prev = 25;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 28:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 25]]);
        }))();
    }
};
//# sourceMappingURL=forget-pass.controller.js.map