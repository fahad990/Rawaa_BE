'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cartona = require('../../controllers/cartona/cartona.controller');

var _cartona2 = _interopRequireDefault(_cartona);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('../../services/multer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/').post((0, _multer.multerSaveTo)('cartona').single('img'), _cartona2.default.validateBody(), _cartona2.default.createCartona).get(_cartona2.default.allCartones);

router.route('/:cartonId').put((0, _multer.multerSaveTo)('cartona').single('img'), _cartona2.default.updateCartona).get(_cartona2.default.cartonDetails);
router.route('/:cartonId/available').put(_cartona2.default.updateAvalaibiltyOfCarton);
exports.default = router;
//# sourceMappingURL=cartona.route.js.map