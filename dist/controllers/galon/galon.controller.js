'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _galon = require('../../models/galon.model');

var _galon2 = _interopRequireDefault(_galon);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _index = require('../../utils/index');

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("size").exists().withMessage("numberOfBottles is required"), (0, _check.body)("priceOfBuying").exists().withMessage("priceOfBuying is required")];
    },

    //create new galon
    createGalon: function createGalon(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, newDoc;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context.prev = 3;

                            if (!(req.user.type == "PROVIDER")) {
                                next(new _ApiError2.default(403, 'not provider user'));
                            }

                            if (!req.file) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 8;
                            return (0, _index.toImgUrl)(req.file);

                        case 8:
                            req.body.img = _context.sent;
                            _context.next = 12;
                            break;

                        case 11:
                            next(new _ApiError2.default(422, 'img is required'));

                        case 12:
                            req.body.user = req.user._id;
                            _context.next = 15;
                            return _galon2.default.create(req.body);

                        case 15:
                            newDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newDoc));

                        case 19:
                            _context.prev = 19;
                            _context.t0 = _context['catch'](3);

                            next(_context.t0);

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[3, 19]]);
        }))();
    },


    //retrive all galons 
    allGalons: function allGalons(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, query, docsCount, allDocs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            limit = parseInt(req.query.limit) || 200;
                            page = req.query.page || 1;
                            query = {};
                            _context2.prev = 3;

                            query.available = true;
                            _context2.next = 7;
                            return _galon2.default.count(query);

                        case 7:
                            docsCount = _context2.sent;
                            _context2.next = 10;
                            return _galon2.default.find(query).populate('user').skip(page * limit - limit).limit(limit).sort({ creationDate: -1 });

                        case 10:
                            allDocs = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(docsCount / limit), limit, docsCount, req)));

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2['catch'](3);

                            next(_context2.t0);

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[3, 14]]);
        }))();
    },


    //retrive one galone details 
    galonDetails: function galonDetails(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var galonId, doc;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            galonId = req.params.galonId;
                            _context3.next = 3;
                            return _galon2.default.findById(galonId);

                        case 3:
                            doc = _context3.sent;

                            if (doc) {
                                _context3.next = 6;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(404)));

                        case 6:
                            return _context3.abrupt('return', res.status(200).json(doc));

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },


    //update one galon details 
    updateGalon: function updateGalon(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var galonId, galon, newGalon;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            galonId = req.params.galonId;
                            _context4.prev = 1;
                            _context4.next = 4;
                            return _galon2.default.findById(galonId);

                        case 4:
                            galon = _context4.sent;

                            if (req.user.id == galon.user) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(403, "not have access to this resourse")));

                        case 7:
                            if (!req.file) {
                                _context4.next = 11;
                                break;
                            }

                            _context4.next = 10;
                            return (0, _index.toImgUrl)(req.file);

                        case 10:
                            req.body.img = _context4.sent;

                        case 11:
                            _context4.next = 13;
                            return _galon2.default.update({ _id: galonId }, {
                                $set: {
                                    size: req.body.size || galon.size,
                                    img: req.body.img || galon.img,
                                    available: req.body.available || galon.available,
                                    priceOfBuying: req.body.priceOfBuying || galon.priceOfBuying,
                                    priceOfSubstitution: req.body.priceOfSubstitution || galon.priceOfSubstitution,
                                    minimumNumberOnOrder: req.body.minimumNumberOnOrder || galon.minimumNumberOnOrder
                                }
                            });

                        case 13:
                            _context4.next = 15;
                            return _galon2.default.findById(galonId).populate('user');

                        case 15:
                            newGalon = _context4.sent;
                            return _context4.abrupt('return', res.status(200).json(newGalon));

                        case 19:
                            _context4.prev = 19;
                            _context4.t0 = _context4['catch'](1);

                            next(_context4.t0);

                        case 22:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[1, 19]]);
        }))();
    },


    //retrive all galons under one provider 
    galonsOfOneProvider: function galonsOfOneProvider(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var limit, page, userId, query, docsCount, allDocs;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            limit = parseInt(req.query.limit) || 200;
                            page = req.query.page || 1;
                            userId = req.params.userId;
                            _context5.prev = 3;
                            query = {};

                            query.available = true;
                            query.user = userId;
                            _context5.next = 9;
                            return _galon2.default.count(query);

                        case 9:
                            docsCount = _context5.sent;
                            _context5.next = 12;
                            return _galon2.default.find(query).populate('user').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 12:
                            allDocs = _context5.sent;
                            return _context5.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(docsCount / limit), limit, docsCount, req)));

                        case 16:
                            _context5.prev = 16;
                            _context5.t0 = _context5['catch'](3);

                            next(_context5.t0);

                        case 19:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[3, 16]]);
        }))();
    },

    //make carttons available
    updateAvalaibiltyOfGalons: function updateAvalaibiltyOfGalons(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var galonId, galonDetails;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            galonId = req.params.galonId;
                            _context6.next = 4;
                            return _galon2.default.findById(galonId);

                        case 4:
                            galonDetails = _context6.sent;

                            if (galonDetails) {
                                _context6.next = 7;
                                break;
                            }

                            return _context6.abrupt('return', res.status(404).end());

                        case 7:

                            if (galonDetails.available == true) galonDetails.available = false;else galonDetails.available = true;

                            _context6.next = 10;
                            return galonDetails.save();

                        case 10:
                            return _context6.abrupt('return', res.status(204).end());

                        case 13:
                            _context6.prev = 13;
                            _context6.t0 = _context6['catch'](0);

                            next(_context6.t0);

                        case 16:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6, [[0, 13]]);
        }))();
    }
};
//# sourceMappingURL=galon.controller.js.map