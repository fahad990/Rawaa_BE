'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _messageAdmin = require('../models/message-admin.model');

var _messageAdmin2 = _interopRequireDefault(_messageAdmin);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    createMessage: function createMessage(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var targetId, userId, object, newMessage;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            targetId = req.params.userId;
                            userId = req.user.id;
                            object = {
                                user: userId,
                                text: req.body.text,
                                targetUser: targetId
                            };
                            _context.next = 6;
                            return _messageAdmin2.default.create(object);

                        case 6:
                            newMessage = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newMessage));

                        case 10:
                            _context.prev = 10;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 10]]);
        }))();
    },

    //retrive all messages
    allMessageOfOneUser: function allMessageOfOneUser(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var userId, allDocs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            userId = req.params.userId;
                            _context2.next = 4;
                            return _messageAdmin2.default.find({ targetUser: userId }).populate('targetUser').populate('user');

                        case 4:
                            allDocs = _context2.sent;
                            return _context2.abrupt('return', res.status(200).json(allDocs));

                        case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 11:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 8]]);
        }))();
    }
};
//# sourceMappingURL=messageAdmin.controller.js.map