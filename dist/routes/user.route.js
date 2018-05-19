'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

var _galon = require('../controllers/galon/galon.controller');

var _galon2 = _interopRequireDefault(_galon);

var _cartona = require('../controllers/cartona/cartona.controller');

var _cartona2 = _interopRequireDefault(_cartona);

var _notification = require('../controllers/notification.controller');

var _notification2 = _interopRequireDefault(_notification);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require('../services/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _multer = require('../services/multer');

var _pushNotification = require('./push-notification.route');

var _pushNotification2 = _interopRequireDefault(_pushNotification);

var _checkBlockUser = require('../helpers/check-block-user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireSignIn = _passport2.default.authenticate('local', { session: false });
var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();

router.use(_pushNotification2.default);

router.route('/signup').post((0, _multer.multerSaveTo)('users').single('img'), _user2.default.validateBody(), _user2.default.signUp);

router.post("/signin", requireSignIn, _user2.default.signin);

router.route("/users/:userId/galons").get(requireAuth, _galon2.default.galonsOfOneProvider);

router.route('/users/:userId').put(requireAuth, (0, _multer.multerSaveTo)('users').single('img'), _user2.default.updateProfile).get(requireAuth, _user2.default.reriveUserDetails);

router.route("/users/:userId/cartons").get(requireAuth, _checkBlockUser.checkBlockUser, _cartona2.default.cartonsOfOneProvider);

router.route("/users/:userId/notification").get(requireAuth, _checkBlockUser.checkBlockUser, _notification2.default.retriveAllNotification);

router.route('/users/:userId/orders/completed').get(requireAuth, _checkBlockUser.checkBlockUser, _user2.default.completedOrderOfOneUser);

router.route('/users/:userId/orders/un-completed').get(requireAuth, _checkBlockUser.checkBlockUser, _user2.default.unCompletedOrderOfOneUser);

exports.default = router;
//# sourceMappingURL=user.route.js.map