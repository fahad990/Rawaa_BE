'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user.route');

var _user2 = _interopRequireDefault(_user);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _galon = require('./galon/galon.route');

var _galon2 = _interopRequireDefault(_galon);

var _cartona = require('./cartona/cartona.route');

var _cartona2 = _interopRequireDefault(_cartona);

var _order = require('./order.route');

var _order2 = _interopRequireDefault(_order);

var _admin = require('./admin.route');

var _admin2 = _interopRequireDefault(_admin);

var _providers = require('./providers.route');

var _providers2 = _interopRequireDefault(_providers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.use('/', _user2.default);
router.use('/cartons', requireAuth, _cartona2.default);
router.use('/galons', requireAuth, _galon2.default);
router.use('/', _order2.default);
router.use('/admin', _admin2.default);
router.use('/providers', _providers2.default);
exports.default = router;
//# sourceMappingURL=index.js.map