'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _order = require('../controllers/order.controller');

var _order2 = _interopRequireDefault(_order);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _checkBlockUser = require('../helpers/check-block-user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/users/:userId/orders').post(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.validateBody(), _order2.default.createOrder);

router.route('/providers/:providerId/orders').get(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.allOrdersOfProvider);
//retrive one order details
router.route('/orders/:orderId').get(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.orderDetails);
//accept order 
router.route('/orders/:orderId/accept').put(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.acceptOrder);
//refuse order 
router.route('/orders/:orderId/refuse').put(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.refuseOrder);

router.route('/orders/:orderId/refuse-reasone').put(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.sendReasoneOfRefuseOrder);

//on the way order 
router.route('/orders/:orderId/on-the-Way').put(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.makeOrderOnDiliver);
//make order done 
router.route('/orders/:orderId/delivered').put(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.makeOrderDone);

//get distance between 2 point locations
router.route('/orders/pric-distance').post(requireAuth, _checkBlockUser.checkBlockUser, _order2.default.validateBodyOfCalulatePrice(), _order2.default.calculatePriceOfDistance);
exports.default = router;
//# sourceMappingURL=order.route.js.map