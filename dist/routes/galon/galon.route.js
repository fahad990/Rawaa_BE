'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _galon = require('../../controllers/galon/galon.controller');

var _galon2 = _interopRequireDefault(_galon);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('../../services/multer');

var _cartona = require('../../controllers/cartona/cartona.controller');

var _cartona2 = _interopRequireDefault(_cartona);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/').post((0, _multer.multerSaveTo)('galons').single('img'), _galon2.default.validateBody(), _galon2.default.createGalon).get(_galon2.default.allGalons);

router.route('/:galonId').get(_galon2.default.galonDetails).put((0, _multer.multerSaveTo)('galons').single('img'), _galon2.default.updateGalon);

router.route('/:galonId/available').put(_galon2.default.updateAvalaibiltyOfGalons);
exports.default = router;
//# sourceMappingURL=galon.route.js.map