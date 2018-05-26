'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _order = require('../models/order.model');

var _order2 = _interopRequireDefault(_order);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _priceOfKm = require('../models/price-of-km.model');

var _priceOfKm2 = _interopRequireDefault(_priceOfKm);

var _pushNotifications = require('../services/push-notifications');

var _notification = require('../models/notification.model');

var _notification2 = _interopRequireDefault(_notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};
exports.default = {
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("price").exists().withMessage("price is required"), (0, _check.body)("provider").exists().withMessage("provider is required")];
    },

    //create new order 
    createOrder: function createOrder(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, objectToCreated, cartonsArray, cartons, cartonsQuantity, x, galonsArray, galons, galonsQuantityOfBuying, galonsQuantityOfSubstitution, galonsType, z, lang, lat, orderLocation, newOrder, newNoti, title, _body, retriveOrder, lenOfCartons, result, resultcartons, resultcartonsQuantity, _x2, item, quantityItem, lenOfGalons, resultGalons, resultGalonsQuantityOfBuying, resultGalonsQuantityOfSubstitution, resultGalonsTypeOrder, _x3, _item, quantityOfBuying, quantityOfSubstitution;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context.next = 4;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            objectToCreated = {};
                            //prepare carton data [[{id : 5, quantity : 8}]]

                            if (req.body.cartons) {
                                cartonsArray = req.body.cartons;
                                cartons = [];
                                cartonsQuantity = [];

                                for (x = 0; x < cartonsArray.length; x++) {
                                    cartons.push(cartonsArray[x].id);
                                    cartonsQuantity.push(cartonsArray[x].quantity);
                                }
                                objectToCreated.cartons = cartons;
                                objectToCreated.cartonsQuantity = cartonsQuantity;
                            }

                            //prepare galons data 
                            if (req.body.galons) {
                                galonsArray = req.body.galons;
                                galons = [];
                                galonsQuantityOfBuying = [];
                                galonsQuantityOfSubstitution = [];
                                galonsType = [];

                                for (z = 0; z < galonsArray.length; z++) {
                                    galons.push(galonsArray[z].id);
                                    galonsQuantityOfBuying.push(galonsArray[z].quantityOfBuying);
                                    galonsQuantityOfSubstitution.push(galonsArray[z].quantityOfSubstitution);
                                    galonsType.push(galonsArray[z].typeOrder);
                                }
                                objectToCreated.galons = galons;
                                objectToCreated.galonsQuantityOfBuying = galonsQuantityOfBuying;
                                objectToCreated.galonsQuantityOfSubstitution = galonsQuantityOfSubstitution;
                            }
                            //prepare location 
                            lang = req.body.lang;
                            lat = req.body.lat;
                            orderLocation = [lang, lat];

                            objectToCreated.location = orderLocation;
                            objectToCreated.provider = req.body.provider;
                            objectToCreated.customer = req.user.id;
                            objectToCreated.price = req.body.price;
                            objectToCreated.deliveryPrice = req.body.deliveryPrice;
                            _context.next = 17;
                            return _order2.default.create(objectToCreated);

                        case 17:
                            newOrder = _context.sent;
                            _context.next = 20;
                            return _notification2.default.create({
                                targetUser: newOrder.provider,
                                order: newOrder,
                                text: 'لديك طلب جديد'
                            });

                        case 20:
                            newNoti = _context.sent;


                            //send notifications
                            title = "لديك طلب جديد";
                            _body = "new Order";

                            (0, _pushNotifications.send)(newOrder.provider, title, _body);

                            //prepare response    
                            _context.next = 26;
                            return _order2.default.findById(newOrder.id).populate('cartons').populate('galons').populate('customer').populate('provider');

                        case 26:
                            retriveOrder = _context.sent;
                            _context.next = 29;
                            return retriveOrder.cartons.length;

                        case 29:
                            lenOfCartons = _context.sent;
                            result = {};

                            result.cartons = [];
                            //prepare cartons 
                            resultcartons = retriveOrder.cartons;
                            resultcartonsQuantity = retriveOrder.cartonsQuantity;

                            for (_x2 = 0; _x2 < lenOfCartons; _x2++) {
                                item = resultcartons[_x2];
                                quantityItem = resultcartonsQuantity[_x2];

                                result.cartons.push({ "item": item, "quantity": quantityItem });
                            }
                            //prepare galons 
                            _context.next = 37;
                            return retriveOrder.galons.length;

                        case 37:
                            lenOfGalons = _context.sent;

                            result.galons = [];
                            resultGalons = retriveOrder.galons;
                            resultGalonsQuantityOfBuying = retriveOrder.galonsQuantityOfBuying;
                            resultGalonsQuantityOfSubstitution = retriveOrder.galonsQuantityOfSubstitution;
                            resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;

                            for (_x3 = 0; _x3 < lenOfGalons; _x3++) {
                                _item = resultGalons[_x3];
                                quantityOfBuying = resultGalonsQuantityOfBuying[_x3];
                                quantityOfSubstitution = resultGalonsQuantityOfSubstitution[_x3];

                                result.galons.push({
                                    item: _item,
                                    quantityOfBuying: quantityOfBuying,
                                    typeOrderOfSubstitution: quantityOfSubstitution
                                });
                            }
                            result.price = retriveOrder.price;
                            result.location = retriveOrder.location;
                            result.customer = retriveOrder.customer;
                            result.provider = retriveOrder.provider;
                            result.status = retriveOrder.status;
                            result.creationDate = retriveOrder.creationDate;
                            result.id = retriveOrder.id;
                            result.deliveryPrice = retriveOrder.deliveryPrice;

                            return _context.abrupt('return', res.status(201).json(result));

                        case 55:
                            _context.prev = 55;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 58:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 55]]);
        }))();
    },

    //retrive all orders under specific provider 
    allOrdersOfProvider: function allOrdersOfProvider(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, query, allOrders, result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            query = {};

                            if (req.query.status) query.status = req.query.status;
                            query.provider = req.params.providerId;
                            _context2.next = 8;
                            return _order2.default.find(query).populate('cartons').populate('galons').populate('customer').populate('provider').skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 });

                        case 8:
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
                                for (var _x4 = 0; _x4 < galons.length; _x4++) {
                                    var oneGalonsItem = {};
                                    var _item2 = galons[_x4];
                                    var QuantityOfBuying = galonsQuantityOfBuying[_x4];
                                    var QuantityOfSubstitution = galonsQuantityOfSubstitution[_x4];
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
                            _context2.next = 16;
                            break;

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 13]]);
        }))();
    },


    //validation input of calulate price 
    validateBodyOfCalulatePrice: function validateBodyOfCalulatePrice() {
        return [(0, _check.body)("from").exists().withMessage("from location is required"), (0, _check.body)("to").exists().withMessage("to location is required")];
    },

    //calulate price of distance between provider and dilver location of order
    calculatePriceOfDistance: function calculatePriceOfDistance(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var validationErrors, lang1, lat1, lang2, lat2, R, dLat, dLon, a, c, d, price, cost;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context3.next = 4;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            //first locattion point
                            lang1 = parseFloat(req.body.from.lang);
                            lat1 = parseFloat(req.body.from.lat);
                            //scound location point

                            lang2 = parseFloat(req.body.to.lang);
                            lat2 = parseFloat(req.body.to.lat);
                            R = 6371; // Radius of the earth in km

                            dLat = deg2rad(lat2 - lat1); // deg2rad above

                            dLon = deg2rad(lang2 - lang1);
                            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            d = Math.ceil(R * c); // Distance in km

                            console.log(d);
                            //fetch price for each km
                            _context3.next = 17;
                            return _priceOfKm2.default.findOne();

                        case 17:
                            price = _context3.sent;
                            cost = Math.ceil(d * price.price);
                            return _context3.abrupt('return', res.status(200).json({
                                "cost": cost,
                                "distance": d,
                                "priceOfEachKm": price.price
                            }));

                        case 22:
                            _context3.prev = 22;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 25:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 22]]);
        }))();
    },

    //retrive one order details
    orderDetails: function orderDetails(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var orderId, retriveOrder, lenOfCartons, result, resultcartons, resultcartonsQuantity, x, item, quantityItem, lenOfGalons, resultGalons, resultGalonsQuantityOfBuying, resultGalonsQuantityOfSubstitution, resultGalonsTypeOrder, _x5, _item3, quantityOfBuying, quantityOfSubstitution;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            orderId = req.params.orderId;
                            _context4.prev = 1;
                            _context4.next = 4;
                            return _order2.default.findById(orderId).populate('cartons').populate('galons').populate('customer').populate('provider');

                        case 4:
                            retriveOrder = _context4.sent;

                            if (retriveOrder) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 7:
                            lenOfCartons = retriveOrder.cartons.length;
                            result = {};

                            result.cartons = [];
                            //prepare cartons 
                            resultcartons = retriveOrder.cartons;
                            resultcartonsQuantity = retriveOrder.cartonsQuantity;

                            for (x = 0; x < lenOfCartons; x++) {
                                item = resultcartons[x];
                                quantityItem = resultcartonsQuantity[x];

                                result.cartons.push({ "item": item, "quantity": quantityItem });
                            }
                            //prepare galons 
                            lenOfGalons = retriveOrder.galons.length;

                            result.galons = [];
                            resultGalons = retriveOrder.galons;
                            resultGalonsQuantityOfBuying = retriveOrder.galonsQuantityOfBuying;
                            resultGalonsQuantityOfSubstitution = retriveOrder.galonsQuantityOfSubstitution;
                            resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;

                            for (_x5 = 0; _x5 < lenOfGalons; _x5++) {
                                _item3 = resultGalons[_x5];
                                quantityOfBuying = resultGalonsQuantityOfBuying[_x5];
                                quantityOfSubstitution = resultGalonsQuantityOfSubstitution[_x5];

                                result.galons.push({
                                    "item": _item3,
                                    "quantityOfBuying": quantityOfBuying,
                                    "typeOrderOfSubstitution": quantityOfSubstitution
                                });
                            }
                            result.price = retriveOrder.price;
                            result.location = retriveOrder.location;
                            result.customer = retriveOrder.customer;
                            result.provider = retriveOrder.provider;
                            result.status = retriveOrder.status;
                            result.creationDate = retriveOrder.creationDate;
                            result.id = retriveOrder.id;
                            result.deliveryPrice = retriveOrder.deliveryPrice;
                            return _context4.abrupt('return', res.status(200).json(result));

                        case 31:
                            _context4.prev = 31;
                            _context4.t0 = _context4['catch'](1);

                            next(_context4.t0);

                        case 34:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[1, 31]]);
        }))();
    },

    //accept order
    acceptOrder: function acceptOrder(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var orderId, orderDetails, provider, newOrder, newNoti, title, _body2;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            orderId = req.params.orderId;
                            _context5.prev = 1;
                            _context5.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context5.sent;

                            if (orderDetails) {
                                _context5.next = 7;
                                break;
                            }

                            return _context5.abrupt('return', res.status(404).end());

                        case 7:
                            provider = orderDetails.provider;

                            if (provider == req.user.id) {
                                _context5.next = 10;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(403, "not access to this operation")));

                        case 10:
                            _context5.next = 12;
                            return _order2.default.findByIdAndUpdate(orderId, { status: "accepted" }, { new: true });

                        case 12:
                            newOrder = _context5.sent;
                            _context5.next = 15;
                            return _notification2.default.create({
                                targetUser: newOrder.customer,
                                order: newOrder,
                                text: 'تم قبول طلبك بنجاح يمكنك الآن الاتصال بموفر الخدمة'
                            });

                        case 15:
                            newNoti = _context5.sent;

                            //send notification to client
                            title = "إشعار بشأن طلبك ";
                            _body2 = ' تم قبول طلبك بنجاح يمكنك الآن الاتصال بموفر الخدمة';

                            (0, _pushNotifications.send)(newOrder.customer, title, _body2);

                            console.log(newOrder.status);

                            return _context5.abrupt('return', res.status(204).end());

                        case 23:
                            _context5.prev = 23;
                            _context5.t0 = _context5['catch'](1);

                            next(_context5.t0);

                        case 26:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[1, 23]]);
        }))();
    },

    //refuse order by provider
    refuseOrder: function refuseOrder(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var orderId, orderDetails, provider, newOrder, title, _body3, newNoti;

            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            orderId = req.params.orderId;
                            _context6.prev = 1;
                            _context6.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context6.sent;

                            if (orderDetails) {
                                _context6.next = 7;
                                break;
                            }

                            return _context6.abrupt('return', res.status(404).end());

                        case 7:
                            provider = orderDetails.provider;

                            if (provider == req.user.id) {
                                _context6.next = 10;
                                break;
                            }

                            return _context6.abrupt('return', next(new _ApiError2.default(403, "not access to this operation")));

                        case 10:
                            _context6.next = 12;
                            return _order2.default.findByIdAndUpdate(orderId, { status: "rejected" }, { new: true });

                        case 12:
                            newOrder = _context6.sent;

                            console.log(newOrder.status);

                            //send notification to client
                            title = "إشعار بشأن طلبك";
                            _body3 = ' نعتذر لعدم قبول طلبك';

                            (0, _pushNotifications.send)(newOrder.customer, title, _body3);

                            //inApp notification 
                            _context6.next = 19;
                            return _notification2.default.create({
                                targetUser: newOrder.customer,
                                order: newOrder,
                                text: 'نعتذر لعدم قبول طلبك'
                            });

                        case 19:
                            newNoti = _context6.sent;
                            return _context6.abrupt('return', res.status(204).end());

                        case 23:
                            _context6.prev = 23;
                            _context6.t0 = _context6['catch'](1);

                            next(_context6.t0);

                        case 26:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6, [[1, 23]]);
        }))();
    },

    // make order ondiliver order 
    makeOrderOnDiliver: function makeOrderOnDiliver(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var orderId, orderDetails, provider, newOrder, title, _body4, newNoti;

            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            orderId = req.params.orderId;
                            _context7.prev = 1;
                            _context7.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context7.sent;

                            if (orderDetails) {
                                _context7.next = 7;
                                break;
                            }

                            return _context7.abrupt('return', res.status(404).end());

                        case 7:
                            provider = orderDetails.provider;

                            if (provider == req.user.id) {
                                _context7.next = 10;
                                break;
                            }

                            return _context7.abrupt('return', next(new _ApiError2.default(403, "not access to this operation")));

                        case 10:
                            _context7.next = 12;
                            return _order2.default.findByIdAndUpdate(orderId, { status: "onTheWay" }, { new: true });

                        case 12:
                            newOrder = _context7.sent;

                            //send notification to provider by completed order 
                            title = "إشعار بشأن طلبك";
                            _body4 = "طلبك في الطريق إليك  يرجى الانتظار";

                            (0, _pushNotifications.send)(newOrder.customer, title, _body4);
                            //inApp notification 
                            _context7.next = 18;
                            return _notification2.default.create({
                                targetUser: newOrder.customer,
                                order: newOrder.id,
                                text: 'طلبك في الطريق إليك  يرجى الانتظار'
                            });

                        case 18:
                            newNoti = _context7.sent;

                            console.log(newOrder.status);

                            return _context7.abrupt('return', res.status(204).end());

                        case 23:
                            _context7.prev = 23;
                            _context7.t0 = _context7['catch'](1);

                            next(_context7.t0);

                        case 26:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this7, [[1, 23]]);
        }))();
    },

    // make order done by user 
    makeOrderDone: function makeOrderDone(req, res, next) {
        var _this8 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var orderId, orderDetails, customer, newOrder, newNoti, _body5, title;

            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            orderId = req.params.orderId;
                            _context8.prev = 1;
                            _context8.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context8.sent;

                            if (orderDetails) {
                                _context8.next = 7;
                                break;
                            }

                            return _context8.abrupt('return', res.status(404).end());

                        case 7:
                            customer = orderDetails.customer;

                            if (customer == req.user.id) {
                                _context8.next = 10;
                                break;
                            }

                            return _context8.abrupt('return', next(new _ApiError2.default(403, "not access to this operation")));

                        case 10:
                            _context8.next = 12;
                            return _order2.default.findByIdAndUpdate(orderId, { status: "delivered" }, { new: true });

                        case 12:
                            newOrder = _context8.sent;
                            _context8.next = 15;
                            return _notification2.default.create({
                                targetUser: newOrder.provider,
                                order: newOrder.id,
                                text: 'لقد تم اتمام الطلب بنجاح'
                            });

                        case 15:
                            newNoti = _context8.sent;


                            //send notification to provider by completed order 
                            _body5 = 'لقد تم اتمام الطلب بنجاح';
                            title = "إشعار بشأن طلبك";

                            (0, _pushNotifications.send)(orderDetails.provider, title, _body5);

                            console.log(newOrder.status);

                            return _context8.abrupt('return', res.status(204).end());

                        case 23:
                            _context8.prev = 23;
                            _context8.t0 = _context8['catch'](1);

                            next(_context8.t0);

                        case 26:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, _this8, [[1, 23]]);
        }))();
    },


    //reasone of refuse order 
    sendReasoneOfRefuseOrder: function sendReasoneOfRefuseOrder(req, res, next) {
        var _this9 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var orderId, orderDetails, newOrder, newNoti, _body6, title;

            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.prev = 0;
                            orderId = req.params.orderId;
                            _context9.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context9.sent;

                            if (orderDetails) {
                                _context9.next = 7;
                                break;
                            }

                            return _context9.abrupt('return', res.status(404).end());

                        case 7:

                            orderDetails.note = req.body.note;
                            _context9.next = 10;
                            return orderDetails.save();

                        case 10:
                            _context9.next = 12;
                            return _order2.default.findById(orderId);

                        case 12:
                            newOrder = _context9.sent;
                            _context9.next = 15;
                            return _notification2.default.create({
                                targetUser: newOrder.customer,
                                order: newOrder.id,
                                text: newOrder.note
                            });

                        case 15:
                            newNoti = _context9.sent;


                            //send notification to provider by completed order 
                            _body6 = newOrder.note;
                            title = "اعتذار لرفض الطلب";

                            (0, _pushNotifications.send)(orderDetails.customer, title, _body6);
                            return _context9.abrupt('return', res.status(204).end());

                        case 22:
                            _context9.prev = 22;
                            _context9.t0 = _context9['catch'](0);

                            next(_context9.t0);

                        case 25:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, _this9, [[0, 22]]);
        }))();
    },


    //canceled order by customer 
    canceleOrder: function canceleOrder(req, res, next) {
        var _this10 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
            var orderId, orderDetails, newOrder;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.prev = 0;
                            orderId = req.params.orderId;
                            _context10.next = 4;
                            return _order2.default.findById(orderId);

                        case 4:
                            orderDetails = _context10.sent;

                            if (orderDetails) {
                                _context10.next = 7;
                                break;
                            }

                            return _context10.abrupt('return', res.status(404).end());

                        case 7:
                            if (!(orderDetails.status == "accepted" || orderDetails.status == "onTheWay")) {
                                _context10.next = 9;
                                break;
                            }

                            return _context10.abrupt('return', res.status(400).json({
                                'message': "can't cancel order now"
                            }));

                        case 9:
                            _context10.next = 11;
                            return _order2.default.findByIdAndUpdate(orderId, { status: "canceled" }, { new: true });

                        case 11:
                            newOrder = _context10.sent;

                            console.log(newOrder.status);
                            return _context10.abrupt('return', res.status(204).end());

                        case 16:
                            _context10.prev = 16;
                            _context10.t0 = _context10['catch'](0);

                            next(_context10.t0);

                        case 19:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, _this10, [[0, 16]]);
        }))();
    }
};
//# sourceMappingURL=order.controller.js.map