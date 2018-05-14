'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkBlockUser = undefined;

var checkBlockUser = exports.checkBlockUser = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var userId, userDettails;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        userId = req.user.id;
                        _context.next = 4;
                        return _user2.default.findById(userId);

                    case 4:
                        userDettails = _context.sent;

                        if (!(userDettails.active == false)) {
                            _context.next = 10;
                            break;
                        }

                        console.log('mmmm');
                        return _context.abrupt('return', next(new _ApiError2.default(403, 'de-active user')));

                    case 10:
                        console.log('cdcdc');
                        next();

                    case 12:
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](0);

                        next(_context.t0);

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 14]]);
    }));

    return function checkBlockUser(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _ApiError = require('./ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=check-block-user.js.map