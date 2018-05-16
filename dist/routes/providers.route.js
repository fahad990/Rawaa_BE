'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require('../services/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _multer = require('../services/multer');

var _provider = require('../controllers/provider.controller');

var _provider2 = _interopRequireDefault(_provider);

var _checkBlockUser = require('../helpers/check-block-user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireSignIn = _passport2.default.authenticate('local', { session: false });
var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.route('/:providerId/reports').get(requireAuth, _provider2.default.retriveSomeOfReports);

router.route('/:providerId/orders/un-completed').get(requireAuth, _checkBlockUser.checkBlockUser, _provider2.default.unCompletedOrderOfOneProvider);

router.route('/:providerId/orders/completed').get(requireAuth, _checkBlockUser.checkBlockUser, _provider2.default.completedOrderOfOneProvider);

router.route('/:providerId/reports').get(_provider2.default.retriveSomeOfReports);

exports.default = router;
//# sourceMappingURL=providers.route.js.map