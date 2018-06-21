'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _order = require('../models/order.model');

var _order2 = _interopRequireDefault(_order);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    unCompletedOrderOfOneProvider: function unCompletedOrderOfOneProvider(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var limit, page, allOrders, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            limit = parseInt(req.query.limit) || 1100;
                            page = req.query.page || 1;
                            _context.next = 5;
                            return _order2.default.find({
                                $and: [{ provider: req.params.providerId }, { $or: [{ status: "onTheWay" }, { status: "accepted" }, { status: "pendding" }] }]
                            }).populate('cartons').populate('galons').populate('customer').populate('provider').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 5:
                            allOrders = _context.sent;

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
                                for (var _x = 0; _x < galons.length; _x++) {
                                    var oneGalonsItem = {};
                                    var _item = galons[_x];
                                    var QuantityOfBuying = galonsQuantityOfBuying[_x];
                                    var QuantityOfSubstitution = galonsQuantityOfSubstitution[_x];
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
                            _context.next = 13;
                            break;

                        case 10:
                            _context.prev = 10;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 10]]);
        }))();
    },
    completedOrderOfOneProvider: function completedOrderOfOneProvider(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, allOrders, result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 1100;
                            page = req.query.page || 1;
                            _context2.next = 5;
                            return _order2.default.find({
                                $and: [{ provider: req.params.providerId }, { $or: [{ status: "delivered" }, { status: "rejected" }] }]
                            }).populate('cartons').populate('galons').populate('customer').populate('provider').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 5:
                            allOrders = _context2.sent;

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
                                for (var _x2 = 0; _x2 < galons.length; _x2++) {
                                    var oneGalonsItem = {};
                                    var _item2 = galons[_x2];
                                    var QuantityOfBuying = galonsQuantityOfBuying[_x2];
                                    var QuantityOfSubstitution = galonsQuantityOfSubstitution[_x2];
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
                            _context2.next = 13;
                            break;

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 10]]);
        }))();
    },

    //fetch some statistics about provider 
    countOrdersOfProvider: function countOrdersOfProvider(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var providerId, providerDetails, countOfAllOrder, queryComplete, countOfCompleted, queryOfPending, countOfPendding, queryOfRefuse, countOfRefuse;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            providerId = req.params.providerId;
                            _context3.next = 4;
                            return _user2.default.findById(providerId);

                        case 4:
                            providerDetails = _context3.sent;
                            _context3.next = 7;
                            return _order2.default.count({ provider: providerId });

                        case 7:
                            countOfAllOrder = _context3.sent;
                            queryComplete = {};

                            queryComplete.status = "delivered";
                            queryComplete.provider = providerId;
                            _context3.next = 13;
                            return _order2.default.count(queryComplete);

                        case 13:
                            countOfCompleted = _context3.sent;
                            queryOfPending = {};

                            queryOfPending.status = "pendding";
                            queryOfPending.provider = providerId;
                            _context3.next = 19;
                            return _order2.default.count(queryOfPending);

                        case 19:
                            countOfPendding = _context3.sent;
                            queryOfRefuse = {};

                            queryOfRefuse.status = "rejected";
                            queryOfRefuse.provider = providerId;
                            _context3.next = 25;
                            return _order2.default.count(queryOfRefuse);

                        case 25:
                            countOfRefuse = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json({
                                countOfAllOrder: countOfAllOrder,
                                countOfCompleted: countOfCompleted,
                                countOfPendding: countOfPendding,
                                countOfRefuse: countOfRefuse
                            }));

                        case 29:
                            _context3.prev = 29;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 32:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 29]]);
        }))();
    },


    //fech some of reports about providers activities 
    retriveSomeOfReports: function retriveSomeOfReports(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var providerId, query, _req$query, from, to, allOrders, totalProductPrice, totalDeliveryPrice, totalPrice, numberOfOrders;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            providerId = req.params.providerId;
                            query = {};
                            _req$query = req.query, from = _req$query.from, to = _req$query.to;


                            if (from) query.creationDate = { $gte: +from };
                            if (to) query.creationDate = _extends({}, query.creationDate, { $lte: +to });
                            query.provider = providerId;
                            query.status = "delivered";
                            console.log(req.query);
                            _context4.next = 11;
                            return _order2.default.find(query);

                        case 11:
                            allOrders = _context4.sent;
                            totalProductPrice = allOrders.reduce(function (accumulator, currentValue) {
                                return accumulator + currentValue.price;
                            }, 0);

                            console.log(totalProductPrice);
                            totalDeliveryPrice = allOrders.reduce(function (accumulator, currentValue) {
                                return accumulator + currentValue.deliveryPrice;
                            }, 0);
                            totalPrice = totalDeliveryPrice + totalProductPrice;
                            numberOfOrders = allOrders.length;
                            return _context4.abrupt('return', res.status(200).json({
                                totalProductPrice: totalProductPrice,
                                totalDeliveryPrice: totalDeliveryPrice,
                                totalPrice: totalPrice,
                                numberOfOrders: numberOfOrders
                            }));

                        case 20:
                            _context4.prev = 20;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 23:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 20]]);
        }))();
    }
};
//# sourceMappingURL=provider.controller.js.map