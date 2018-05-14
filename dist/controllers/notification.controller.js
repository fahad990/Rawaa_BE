'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _notification = require('../models/notification.model');

var _notification2 = _interopRequireDefault(_notification);

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
    //retrive all notification of one customer
    retriveAllNotification: function retriveAllNotification(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var userId, allNotificattion;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            userId = req.params.userId;
                            _context.next = 4;
                            return _notification2.default.find({ targetUser: userId }).populate({
                                path: 'order',
                                populate: { path: 'customer', model: 'user' }
                            }).sort({ creationDate: -1 });

                        case 4:
                            allNotificattion = _context.sent;
                            return _context.abrupt('return', res.status(200).json(allNotificattion));

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 8]]);
        }))();
    }
};
//# sourceMappingURL=notification.controller.js.map