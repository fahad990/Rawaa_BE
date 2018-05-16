import mongoose from 'mongoose';
import ApiResponse from '../helpers/ApiResponse';
import ApiError from '../helpers/ApiError';
import Order from '../models/order.model';
import User from '../models/user.model'

export default {
    async unCompletedOrderOfOneProvider(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            let page = req.query.page || 1;
            let allOrders = await Order.find({
                $and: [
                    { provider: req.params.providerId },
                    { $or: [{ status: "onTheWay" }, { status: "accepted" }, { status: "pendding" }] }
                ]
            })
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
                .skip((page - 1) * limit).limit(limit)
                .sort({ creationDate: -1 });
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
                OneOrderItem.deliveryPrice = elme.deliveryPrice;
                return OneOrderItem;
            })
            res.send(new ApiResponse(
                result,
                page,
                Math.ceil((result.length) / limit),
                limit,
                result.length,
                req
            ))
        } catch (err) {
            next(err)
        }
    },
    async completedOrderOfOneProvider(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            let page = req.query.page || 1;
            let allOrders = await Order.find({
                $and: [
                    { provider: req.params.providerId },
                    { $or: [{ status: "delivered" }, { status: "rejected" }] }
                ]
            })
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
                .skip((page - 1) * limit).limit(limit)
                .sort({ creationDate: -1 });
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
                OneOrderItem.deliveryPrice = elme.deliveryPrice
                return OneOrderItem;
            })
            res.send(new ApiResponse(
                result,
                page,
                Math.ceil((result.length) / limit),
                limit,
                result.length,
                req
            ))
        } catch (err) {
            next(err)
        }
    },
    //fetch some statistics about provider 
    async countOrdersOfProvider(req, res, next) {
        try {
            let providerId = req.params.providerId;
            let providerDetails = await User.findById(providerId);
            let countOfAllOrder = await Order.count({ provider: providerId });

            let queryComplete = {};
            queryComplete.status = "delivered";
            queryComplete.provider = providerId;
            let countOfCompleted = await Order.count(queryComplete);

            let queryOfPending = {}
            queryOfPending.status = "pendding";
            queryOfPending.provider = providerId;
            let countOfPendding = await Order.count(queryOfPending);

            let queryOfRefuse = {}
            queryOfRefuse.status = "rejected";
            queryOfRefuse.provider = providerId;
            let countOfRefuse = await Order.count(queryOfRefuse);

            return res.status(200).json({
                countOfAllOrder,
                countOfCompleted,
                countOfPendding,
                countOfRefuse
            })
        } catch (err) {
            next(err)
        }
    },
}