'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _forgetPass = require('../controllers/forget-pass.controller');

var _forgetPass2 = _interopRequireDefault(_forgetPass);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/forget-password').put(_forgetPass2.default.forgetPassword);

router.route('/password-code-match').put(_forgetPass2.default.matchCodeOfUserAndResetPass);

exports.default = router;
//# sourceMappingURL=forget-pass.route.js.map