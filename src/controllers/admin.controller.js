import User from '../models/user.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'
import PriceKm from '../models/price-of-km.model';
import Order from '../models/order.model'

var _firebaseAdmin = require("firebase-admin");

//KfQnPp9bNf2S2m6z
export default {
    //create new order 
    async allUsers(req, res, next) {
        try {
            if (req.user.type != "ADMIN")
                return next(new ApiError(403, "not admin user"));

            let query = {}
            if (req.query.type) {
                query.type = req.query.type;
            }
            let users = await User.find(query).sort({ creationDate: -1 });
            return res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    },
    //create price for km in diliver
    async createPriceOfKilloMeter(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            if (!req.body.price)
                return next(new ApiError(422, "price is required"))
            let prices = await PriceKm.find();
            if (prices.length > 0)
                return next(new ApiError(400, "price already exist, update it plz"))
            let newDoc = await PriceKm.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },

    //update price for km in diliver
    async updatePriceOfKilloMeter(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            if (!req.body.price)
                return next(new ApiError(422, "price is required"))
            let price = await PriceKm.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            return res.status(200).json(price)
        } catch (err) {
            next(err)
        }
    },

    //retrive price of KiloMeter 
    async retrivePriceOfOneKm(req, res, next) {
        try {
            let pric = await PriceKm.findOne();
            return res.status(200).json(pric);
        } catch (err) {
            next(err)
        }
    },

    //deactive user account
    async deactiveUser(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return next(new ApiError(404));
            let newUser = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
            console.log(' ASS')
            var db = _firebaseAdmin.database();
            var ref = db.ref("geofire/" + userId);
            ref.remove().then(function() {
              res.send({ status: 'ok' });
            }).catch(function(error) {
              console.log('Error deleting data:', error);
              res.send({ status: 'error', error: error });
            });

            return res.status(200).json(newUser);
        } catch (err) {
            next(err)
        }
    },
    //active user account 
    async activeUser(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return next(new ApiError(404));
            let newUser = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
            return res.status(200).json(newUser);
        } catch (err) {
            next(err)
        }
    },
    async adminStatisttics(req, res, next) {
        let numberOfOrder = await Order.count();
        let penddingOrder = await Order.count({ status: "pendding" });
        let acceptedOrder = await Order.count({ status: "accepted" });
        let rejectedOrder = await Order.count({ status: "rejected" });
        let onTheWayOrder = await Order.count({ status: "onTheWay" });
        let deliveredOrder = await Order.count({ status: "delivered" });
        let numberOfClient = await User.count({ type: "NORMAL" });
        let numberOfProvider = await User.count({ type: "PROVIDER" });
        return res.status(200).json({
            numberOfOrder,
            penddingOrder,
            acceptedOrder,
            rejectedOrder,
            onTheWayOrder,
            deliveredOrder,
            numberOfClient,
            numberOfProvider
        })
    },

    async getRecentOrders(req, res, next) {
        try {
            let allOrders = await Order.find().sort({ creationDate: -1 }).limit(10)
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
            //prepare response 
            let result = allOrders.map(elme => {
                //first prepare cartons
                let OneOrderItem = {};
                let cartonsResult = [];
                let cartons = elme.cartons;
                let cartonsQuantity = elme.cartonsQuantity;
                for (let x = 0; x < cartons.length; x++) {
                    let oneCartonItem = {};
                    let item = cartons[x];
                    let quantity = cartonsQuantity[x]
                    oneCartonItem.item = item;
                    oneCartonItem.quantity = quantity;
                    cartonsResult.push(oneCartonItem);
                }
                //assign cartons result to order item 
                OneOrderItem.cartons = cartonsResult;
                //prepare galons    
                let galonsResult = [];
                let galons = elme.galons;
                let galonsQuantityOfBuying = elme.galonsQuantityOfBuying;
                let galonsQuantityOfSubstitution = elme.galonsQuantityOfSubstitution;
                for (let x = 0; x < galons.length; x++) {
                    let oneGalonsItem = {};
                    let item = galons[x];
                    let QuantityOfBuying = galonsQuantityOfBuying[x]
                    let QuantityOfSubstitution = galonsQuantityOfSubstitution[x]
                    oneGalonsItem.item = item;
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
                return OneOrderItem;
            })
            return res.status(200).json(result)

        } catch (err) {
            next(err)
        }
    },


}