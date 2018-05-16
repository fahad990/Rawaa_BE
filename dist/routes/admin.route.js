'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _admin = require('../controllers/admin.controller');

var _admin2 = _interopRequireDefault(_admin);

var _provider = require('../controllers/provider.controller');

var _provider2 = _interopRequireDefault(_provider);

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

var _messageAdmin = require('../controllers/messageAdmin.controller');

var _messageAdmin2 = _interopRequireDefault(_messageAdmin);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var requireAuth = _passport2.default.authenticate('jwt', { session: false });

router.route('/users').get(requireAuth, _admin2.default.allUsers);
router.route('/counts-numbers').get(_admin2.default.adminStatisttics);

router.route('/price-delivir-km').post(requireAuth, _admin2.default.createPriceOfKilloMeter);

router.route('/price-delivir-km').get(requireAuth, _admin2.default.retrivePriceOfOneKm);

router.route('/orders/recent').get(_admin2.default.getRecentOrders);

router.route('/price-delivir-km/:id').put(requireAuth, _admin2.default.updatePriceOfKilloMeter);

router.route('/users/:userId/de-active').put(requireAuth, _admin2.default.deactiveUser);

router.route('/users/:userId/active').put(requireAuth, _admin2.default.activeUser);

router.route('/users/:userId/messages').post(requireAuth, _messageAdmin2.default.createMessage).get(requireAuth, _messageAdmin2.default.allMessageOfOneUser);

router.route('/providers/:providerId/count-orders').get(_provider2.default.countOrdersOfProvider);

router.route('/users/:customerId/count-orders').get(_user2.default.countOrdersOfCustomer);

exports.default = router;
//# sourceMappingURL=admin.route.js.map