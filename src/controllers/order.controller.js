import Order from '../models/order.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError';
import ApiResponse from '../helpers/ApiResponse';
import Price from '../models/price-of-km.model';
import { send } from '../services/push-notifications';
import NotificationOrder from '../models/notification.model';


let deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}
export default {

    validateBody(isUpdate = false) {
        return [
            body("price").exists().withMessage("price is required"),
            body("provider").exists().withMessage("provider is required"),
        ];
    },
    //create new order 
    async createOrder(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            let objectToCreated = {}
            //prepare carton data [[{id : 5, quantity : 8}]]
            if (req.body.cartons) {
                let cartonsArray = req.body.cartons;
                let cartons = [];
                let cartonsQuantity = [];
                for (let x = 0; x < cartonsArray.length; x++) {
                    cartons.push(cartonsArray[x].id);
                    cartonsQuantity.push(cartonsArray[x].quantity);
                }
                objectToCreated.cartons = cartons;
                objectToCreated.cartonsQuantity = cartonsQuantity
            }

            //prepare galons data 
            if (req.body.galons) {
                let galonsArray = req.body.galons;
                let galons = [];
                let galonsQuantityOfBuying = [];
                let galonsQuantityOfSubstitution = [];
                let galonsType = [];
                for (let z = 0; z < galonsArray.length; z++) {
                    galons.push(galonsArray[z].id);
                    galonsQuantityOfBuying.push(galonsArray[z].quantityOfBuying);
                    galonsQuantityOfSubstitution.push(galonsArray[z].quantityOfSubstitution);
                    galonsType.push(galonsArray[z].typeOrder)
                }
                objectToCreated.galons = galons;
                objectToCreated.galonsQuantityOfBuying = galonsQuantityOfBuying;
                objectToCreated.galonsQuantityOfSubstitution = galonsQuantityOfSubstitution;
            }
            //prepare location 
            let lang = req.body.lang;
            let lat = req.body.lat;
            let orderLocation = [lang, lat];
            objectToCreated.location = orderLocation
            objectToCreated.provider = req.body.provider;
            objectToCreated.customer = req.user.id;
            objectToCreated.price = req.body.price;
            let newOrder = await Order.create(objectToCreated);

            //send notifications
            send(newOrder.provider, "لديك طلب جديد ", 'new Order', result)

            //in app notification 
            let newNoti = await NotificationOrder.create({
                targetUser: newOrder.provider,
                order: newOrder,
                text: 'لديك طلب جديد',
            });

            //prepare response    
            let retriveOrder = await Order.findById(newOrder.id)
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
            let lenOfCartons = await retriveOrder.cartons.length;
            let result = {};
            result.cartons = []
            //prepare cartons 
            let resultcartons = retriveOrder.cartons;
            let resultcartonsQuantity = retriveOrder.cartonsQuantity;
            for (let x = 0; x < lenOfCartons; x++) {
                let item = resultcartons[x];
                let quantityItem = resultcartonsQuantity[x];
                result.cartons.push({ "item": item, "quantity": quantityItem })
            }
            //prepare galons 
            let lenOfGalons = await retriveOrder.galons.length;
            result.galons = [];
            let resultGalons = retriveOrder.galons;
            let resultGalonsQuantityOfBuying = retriveOrder.galonsQuantityOfBuying;
            let resultGalonsQuantityOfSubstitution = retriveOrder.galonsQuantityOfSubstitution;
            let resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;
            for (let x = 0; x < lenOfGalons; x++) {
                let item = resultGalons[x];
                let quantityOfBuying = resultGalonsQuantityOfBuying[x];
                let quantityOfSubstitution = resultGalonsQuantityOfSubstitution[x];
                result.galons.push({
                    item: item,
                    quantityOfBuying: quantityOfBuying,
                    typeOrderOfSubstitution: quantityOfSubstitution
                })
            }
            result.price = retriveOrder.price;
            result.location = retriveOrder.location;
            result.customer = retriveOrder.customer;
            result.provider = retriveOrder.provider;
            result.status = retriveOrder.status;
            result.creationDate = retriveOrder.creationDate;
            result.id = retriveOrder.id


            return res.status(201).json(result)
        } catch (err) {
            next(err)
        }

    },
    //retrive all orders under specific provider 
    async allOrdersOfProvider(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            let page = req.query.page || 1;
            let query = {}
            if (req.query.status)
                query.status = req.query.status;
            query.provider = req.params.providerId;
            let allOrders = await Order.find(query)
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

    //validation input of calulate price 
    validateBodyOfCalulatePrice() {
        return [
            body("from").exists().withMessage("from location is required"),
            body("to").exists().withMessage("to location is required")
        ]
    },
    //calulate price of distance between provider and dilver location of order
    async calculatePriceOfDistance(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            //first locattion point
            let lang1 = parseFloat(req.body.from.lang);
            let lat1 = parseFloat(req.body.from.lat);
            //scound location point
            let lang2 = parseFloat(req.body.to.lang);
            let lat2 = parseFloat(req.body.to.lat);

            let R = 6371; // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1);  // deg2rad above
            let dLon = deg2rad(lang2 - lang1);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c; // Distance in km
            console.log(d);
            //fetch price for each km
            let price = await Price.findOne();
            let cost = d * price.price;
            return res.status(200).json({
                "cost": cost,
                "distance": d,
                "priceOfEachKm": price.price
            });
        } catch (err) {
            next(err)
        }
    },
    //retrive one order details
    async orderDetails(req, res, next) {
        let orderId = req.params.orderId;
        try {
            //prepare response    
            let retriveOrder = await Order.findById(orderId)
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
            if (!retriveOrder)
                return res.status(404).end()
            let lenOfCartons = retriveOrder.cartons.length;
            let result = {};
            result.cartons = []
            //prepare cartons 
            let resultcartons = retriveOrder.cartons;
            let resultcartonsQuantity = retriveOrder.cartonsQuantity;
            for (let x = 0; x < lenOfCartons; x++) {
                let item = resultcartons[x];
                let quantityItem = resultcartonsQuantity[x];
                result.cartons.push({ "item": item, "quantity": quantityItem })
            }
            //prepare galons 
            let lenOfGalons = retriveOrder.galons.length;
            result.galons = [];
            let resultGalons = retriveOrder.galons;
            let resultGalonsQuantityOfBuying = retriveOrder.galonsQuantityOfBuying;
            let resultGalonsQuantityOfSubstitution = retriveOrder.galonsQuantityOfSubstitution;
            let resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;
            for (let x = 0; x < lenOfGalons; x++) {
                let item = resultGalons[x];
                let quantityOfBuying = resultGalonsQuantityOfBuying[x];
                let quantityOfSubstitution = resultGalonsQuantityOfSubstitution[x];
                result.galons.push({
                    "item": item,
                    "quantityOfBuying": quantityOfBuying,
                    "typeOrderOfSubstitution": quantityOfSubstitution
                })
            }
            result.price = retriveOrder.price;
            result.location = retriveOrder.location;
            result.customer = retriveOrder.customer;
            result.provider = retriveOrder.provider;
            result.status = retriveOrder.status;
            result.creationDate = retriveOrder.creationDate;
            result.id = retriveOrder.id
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    },
    //accept order
    async acceptOrder(req, res, next) {
        let orderId = req.params.orderId;
        try {
            let orderDetails = await Order.findById(orderId);
            if (!orderDetails)
                return res.status(404).end();
            let provider = orderDetails.provider;

            if (!(provider == req.user.id))
                return next(new ApiError(403, "not access to this operation"))

            let newOrder = await Order.findByIdAndUpdate(orderId, { status: "accepted" }, { new: true });

            //send notification to client
            send(newOrder.customer, "your Order is accepted", 'ACCepted', newOrder)

            //inApp notificattion 
            let newNoti = await NotificationOrder.create({
                targetUser: newOrder.customer,
                order: newOrder,
                text: 'your Order is accepted'
            })

            console.log(newOrder.status)

            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },
    //refuse order by provider
    async refuseOrder(req, res, next) {
        let orderId = req.params.orderId;
        try {

            let orderDetails = await Order.findById(orderId);
            if (!orderDetails)
                return res.status(404).end();
            let provider = orderDetails.provider;
            if (!(provider == req.user.id))
                return next(new ApiError(403, "not access to this operation"))
            let newOrder = await Order.findByIdAndUpdate(orderId, { status: "rejected" }, { new: true });
            console.log(newOrder.status)
            //send notification to client
            send(newOrder.customer, "نعتذر لعدم قبول طلبك", 'So Soory about That', newOrder)
            //inApp notification 
            let newNoti = await NotificationOrder.create({
                targetUser: newOrder.customer,
                order: newOrder,
                text: 'نعتذر لعدم قبول طلبك'
            })
            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },
    // make order ondiliver order 
    async makeOrderOnDiliver(req, res, next) {
        let orderId = req.params.orderId;
        try {

            let orderDetails = await Order.findById(orderId);
            if (!orderDetails)
                return res.status(404).end();
            let provider = orderDetails.provider;
            if (!(provider == req.user.id))
                return next(new ApiError(403, "not access to this operation"))
            let newOrder = await Order.findByIdAndUpdate(orderId, { status: "onTheWay" }, { new: true });
            //send notification to provider by completed order 
            send(newOrder.customer, "Your Order On The Way ", 'wait it plz', newOrder)
            //inApp notification 
            let newNoti = await NotificationOrder.create({
                targetUser: newOrder.customer,
                order: newOrder.id,
                text: 'Your Order On The Way'
            })
            console.log(newOrder.status)

            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },
    // make order done by user 
    async makeOrderDone(req, res, next) {
        let orderId = req.params.orderId;
        try {
            let orderDetails = await Order.findById(orderId);
            if (!orderDetails)
                return res.status(404).end();
            let customer = orderDetails.customer
            if (!(customer == req.user.id))
                return next(new ApiError(403, "not access to this operation"))
            let newOrder = await Order.findByIdAndUpdate(orderId, { status: "delivered" }, { new: true });
            //send notification to provider by completed order 
            send(orderDetails.provider, "لقد تم اتمام الطلب بنجاح ", 'congratulations', newOrder)
            //inApp notification 
            let newNoti = await NotificationOrder.create({
                targetUser: newOrder.provider,
                order: newOrder.id,
                text: 'لقد تم اتمام الطلب بنجاح'
            })
            console.log(newOrder.status)

            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },

}