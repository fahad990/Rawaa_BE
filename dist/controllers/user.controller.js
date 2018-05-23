"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _multer = require("../services/multer");

var _index = require("../utils/index");

var _order = require("../models/order.model");

var _order2 = _interopRequireDefault(_order);

var _ApiResponse = require("../helpers/ApiResponse");

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jwtSecret = _config2.default.jwtSecret;

var generateToken = function generateToken(id) {

    return _jsonwebtoken2.default.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime()
    }, jwtSecret, { expiresIn: '10000s' });
};

//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
var checkPhone = function checkPhone(inputtxt) {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    } else {
        throw new Error("invalid phone");
    }
};
exports.default = {
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("name").exists().withMessage("name is required"), (0, _check.body)("email").exists().withMessage("Email is required").isEmail().withMessage("Email is invalid syntax").custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _user2.default.findOne({ email: value });

                            case 2:
                                user = _context.sent;

                                if (user) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", true);

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x2, _x3) {
                return _ref.apply(this, arguments);
            };
        }()).withMessage('email exist before'), (0, _check.body)("password").exists().withMessage("password is required"), (0, _check.body)("phone").exists().withMessage("phone is requires")
        //make custome validation to phone to check on phone[unique, isPhone]
        .custom(function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value, _ref4) {
                var req = _ref4.req;
                var userPhoneQuery, user;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //call phone checking pattren function 
                                checkPhone(value);
                                if (isUpdate && req.user.phone == value) userQuery._id = { $ne: req.user._id };
                                userPhoneQuery = { phone: value };
                                _context2.next = 5;
                                return _user2.default.findOne(userPhoneQuery);

                            case 5:
                                user = _context2.sent;

                                if (!user) {
                                    _context2.next = 10;
                                    break;
                                }

                                throw new Error('phone already exists');

                            case 10:
                                return _context2.abrupt("return", true);

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this);
            }));

            return function (_x4, _x5) {
                return _ref3.apply(this, arguments);
            };
        }())];
    },

    //signup logic 
    signUp: function signUp(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var validationErrors, createdUser;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context3.next = 3;
                                break;
                            }

                            return _context3.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context3.prev = 3;

                            if (!req.file) {
                                _context3.next = 8;
                                break;
                            }

                            _context3.next = 7;
                            return (0, _index.toImgUrl)(req.file);

                        case 7:
                            req.body.img = _context3.sent;

                        case 8:

                            if (req.body.type == "PROVIDER") req.body.active = false;

                            _context3.next = 11;
                            return _user2.default.create(req.body);

                        case 11:
                            createdUser = _context3.sent;

                            res.status(201).send({ user: createdUser, token: generateToken(createdUser.id) });
                            _context3.next = 18;
                            break;

                        case 15:
                            _context3.prev = 15;
                            _context3.t0 = _context3["catch"](3);

                            next(_context3.t0);

                        case 18:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this2, [[3, 15]]);
        }))();
    },

    //sign in logic 
    signin: function signin(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var user;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            user = req.user; // Passport

                            console.log(user.type);
                            res.send({ user: user, token: generateToken(user.id) });

                        case 3:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, _this3);
        }))();
    },
    completedOrderOfOneUser: function completedOrderOfOneUser(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var limit, page, allOrders, result;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            _context5.next = 5;
                            return _order2.default.find({
                                $and: [{ customer: req.params.userId }, { $or: [{ status: "delivered" }, { status: "rejected" }] }]
                            }).populate('cartons').populate('galons').populate('customer').populate('provider').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 5:
                            allOrders = _context5.sent;

                            //prepare response 
                            result = allOrders.map(function (elme) {
                                //first prepare cartons
                                var OneOrderItem = {};
                                var cartonsResult = [];
                                var cartons = elme.cartons;
                                var cartonsQuantity = elme.cartonsQuantity;
                                for (var x = 0; x < cartons.length; x++) {
                                    var oneCartonItem = {};
                                    var item = cartons[x];
                                    var quantity = cartonsQuantity[x];
                                    oneCartonItem.item = item;
                                    oneCartonItem.quantity = quantity;
                                    cartonsResult.push(oneCartonItem);
                                }
                                //assign cartons result to order item 
                                OneOrderItem.cartons = cartonsResult;
                                //prepare galons    
                                var galonsResult = [];
                                var galons = elme.galons;
                                var galonsQuantityOfBuying = elme.galonsQuantityOfBuying;
                                var galonsQuantityOfSubstitution = elme.galonsQuantityOfSubstitution;
                                for (var _x6 = 0; _x6 < galons.length; _x6++) {
                                    var oneGalonsItem = {};
                                    var _item = galons[_x6];
                                    var QuantityOfBuying = galonsQuantityOfBuying[_x6];
                                    var QuantityOfSubstitution = galonsQuantityOfSubstitution[_x6];
                                    oneGalonsItem.item = _item;
                                    oneGalonsItem.galonsQuantityOfBuying = QuantityOfBuying;
                                    oneGalonsItem.galonsQuantityOfSubstitution = QuantityOfSubstitution;
                                    galonsResult.push(oneGalonsItem);
                                }
                                //assign galons result to order item 
                                OneOrderItem.galons = galonsResult;
                                OneOrderItem.location = elme.location;
                                OneOrderItem.customer = elme.customer;
                                OneOrderItem.provider = elme.provider;
                                OneOrderItem.status = elme.status;
                                OneOrderItem.creationDate = elme.creationDate;
                                OneOrderItem.id = elme.id;
                                OneOrderItem.price = elme.price;
                                OneOrderItem.deliveryPrice = elme.deliveryPrice;
                                return OneOrderItem;
                            });

                            res.send(new _ApiResponse2.default(result, page, Math.ceil(result.length / limit), limit, result.length, req));
                            _context5.next = 13;
                            break;

                        case 10:
                            _context5.prev = 10;
                            _context5.t0 = _context5["catch"](0);

                            next(_context5.t0);

                        case 13:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, _this4, [[0, 10]]);
        }))();
    },
    unCompletedOrderOfOneUser: function unCompletedOrderOfOneUser(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var limit, page, allOrders, result;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            _context6.next = 5;
                            return _order2.default.find({
                                $and: [{ customer: req.params.userId }, { $or: [{ status: "onTheWay" }, { status: "accepted" }, { status: "pendding" }] }]
                            }).populate('cartons').populate('galons').populate('customer').populate('provider').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 5:
                            allOrders = _context6.sent;

                            //prepare response 
                            result = allOrders.map(function (elme) {
                                //first prepare cartons
                                var OneOrderItem = {};
                                var cartonsResult = [];
                                var cartons = elme.cartons;
                                var cartonsQuantity = elme.cartonsQuantity;
                                for (var x = 0; x < cartons.length; x++) {
                                    var oneCartonItem = {};
                                    var item = cartons[x];
                                    var quantity = cartonsQuantity[x];
                                    oneCartonItem.item = item;
                                    oneCartonItem.quantity = quantity;
                                    cartonsResult.push(oneCartonItem);
                                }
                                //assign cartons result to order item 
                                OneOrderItem.cartons = cartonsResult;
                                //prepare galons    
                                var galonsResult = [];
                                var galons = elme.galons;
                                var galonsQuantityOfBuying = elme.galonsQuantityOfBuying;
                                var galonsQuantityOfSubstitution = elme.galonsQuantityOfSubstitution;
                                for (var _x7 = 0; _x7 < galons.length; _x7++) {
                                    var oneGalonsItem = {};
                                    var _item2 = galons[_x7];
                                    var QuantityOfBuying = galonsQuantityOfBuying[_x7];
                                    var QuantityOfSubstitution = galonsQuantityOfSubstitution[_x7];
                                    oneGalonsItem.item = _item2;
                                    oneGalonsItem.galonsQuantityOfBuying = QuantityOfBuying;
                                    oneGalonsItem.galonsQuantityOfSubstitution = QuantityOfSubstitution;
                                    galonsResult.push(oneGalonsItem);
                                }
                                //assign galons result to order item 
                                OneOrderItem.galons = galonsResult;
                                OneOrderItem.location = elme.location;
                                OneOrderItem.customer = elme.customer;
                                OneOrderItem.provider = elme.provider;
                                OneOrderItem.status = elme.status;
                                OneOrderItem.creationDate = elme.creationDate;
                                OneOrderItem.id = elme.id;
                                OneOrderItem.price = elme.price;
                                OneOrderItem.deliveryPrice = elme.deliveryPrice;
                                return OneOrderItem;
                            });

                            res.send(new _ApiResponse2.default(result, page, Math.ceil(result.length / limit), limit, result.length, req));
                            _context6.next = 13;
                            break;

                        case 10:
                            _context6.prev = 10;
                            _context6.t0 = _context6["catch"](0);

                            next(_context6.t0);

                        case 13:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, _this5, [[0, 10]]);
        }))();
    },

    //fetch some statistics about order 
    countOrdersOfCustomer: function countOrdersOfCustomer(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var customerId, customerDetails, countOfAllOrder, queryComplete, countOfCompleted, queryOfPending, countOfPendding, queryOfRefuse, countOfRefuse;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;
                            customerId = req.params.customerId;
                            _context7.next = 4;
                            return _user2.default.findById(customerId);

                        case 4:
                            customerDetails = _context7.sent;
                            _context7.next = 7;
                            return _order2.default.count({ customer: customerId });

                        case 7:
                            countOfAllOrder = _context7.sent;
                            queryComplete = {};

                            queryComplete.status = "delivered";
                            queryComplete.customer = customerId;
                            _context7.next = 13;
                            return _order2.default.count(queryComplete);

                        case 13:
                            countOfCompleted = _context7.sent;
                            queryOfPending = {};

                            queryOfPending.status = "pendding";
                            queryOfPending.customer = customerId;
                            _context7.next = 19;
                            return _order2.default.count(queryOfPending);

                        case 19:
                            countOfPendding = _context7.sent;
                            queryOfRefuse = {};

                            queryOfRefuse.status = "rejected";
                            queryOfRefuse.customer = customerId;
                            _context7.next = 25;
                            return _order2.default.count(queryOfRefuse);

                        case 25:
                            countOfRefuse = _context7.sent;
                            return _context7.abrupt("return", res.status(200).json({
                                countOfAllOrder: countOfAllOrder,
                                countOfCompleted: countOfCompleted,
                                countOfPendding: countOfPendding,
                                countOfRefuse: countOfRefuse
                            }));

                        case 29:
                            _context7.prev = 29;
                            _context7.t0 = _context7["catch"](0);

                            next(_context7.t0);

                        case 32:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, _this6, [[0, 29]]);
        }))();
    },

    //update profile
    updateProfile: function updateProfile(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var userId, userDetails, newUser;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.prev = 0;
                            userId = req.params.userId;
                            _context8.next = 4;
                            return _user2.default.findById(userId);

                        case 4:
                            userDetails = _context8.sent;

                            if (userDetails) {
                                _context8.next = 7;
                                break;
                            }

                            return _context8.abrupt("return", res.status(404).end());

                        case 7:
                            if (!req.file) {
                                _context8.next = 11;
                                break;
                            }

                            _context8.next = 10;
                            return (0, _index.toImgUrl)(req.file);

                        case 10:
                            req.body.img = _context8.sent;

                        case 11:
                            _context8.next = 13;
                            return _user2.default.findByIdAndUpdate(userId, req.body, { new: true });

                        case 13:
                            newUser = _context8.sent;
                            return _context8.abrupt("return", res.status(200).json(newUser));

                        case 17:
                            _context8.prev = 17;
                            _context8.t0 = _context8["catch"](0);

                            next(_context8.t0);

                        case 20:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, _this7, [[0, 17]]);
        }))();
    },

    //fetch user details 
    reriveUserDetails: function reriveUserDetails(req, res, next) {
        var _this8 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var userId, userDetails;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.prev = 0;
                            userId = req.params.userId;
                            _context9.next = 4;
                            return _user2.default.findById(userId);

                        case 4:
                            userDetails = _context9.sent;

                            if (userDetails) {
                                _context9.next = 7;
                                break;
                            }

                            return _context9.abrupt("return", res.status(404).end());

                        case 7:
                            return _context9.abrupt("return", res.status(200).json(userDetails));

                        case 10:
                            _context9.prev = 10;
                            _context9.t0 = _context9["catch"](0);

                            next(_context9.t0);

                        case 13:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, _this8, [[0, 10]]);
        }))();
    }
};
//# sourceMappingURL=user.controller.js.map