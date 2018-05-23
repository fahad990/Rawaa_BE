import User from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "../config";
import { body, validationResult } from 'express-validator/check';
import mongoose, { Schema } from "mongoose";
import ApiError from '../helpers/ApiError'
import { multerSaveTo } from '../services/multer'
import { toImgUrl } from '../utils/index'
import Order from '../models/order.model'
import ApiResponse from '../helpers/ApiResponse'


const { jwtSecret } = config;
const generateToken = id => {

    return jwt.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime(),
    }, jwtSecret, { expiresIn: '10000s' })
}


//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
const checkPhone = inputtxt => {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    }
    else {
        throw new Error("invalid phone")
    }
}
export default {
    validateBody(isUpdate = false) {
        return [
            body("name").exists().withMessage("name is required"),
            body("email").exists().withMessage("Email is required")
                .isEmail().withMessage("Email is invalid syntax")
                .custom(async (value, { req }) => {
                    let user = await User.findOne({ email: value });
                    if (!user)
                        return true
                }).withMessage('email exist before'),
            body("password").exists().withMessage("password is required"),
            body("phone").exists().withMessage("phone is requires")
                //make custome validation to phone to check on phone[unique, isPhone]
                .custom(async (value, { req }) => {
                    //call phone checking pattren function 
                    checkPhone(value);
                    if (isUpdate && req.user.phone == value)
                        userQuery._id = { $ne: req.user._id };
                    let userPhoneQuery = { phone: value };
                    let user = await User.findOne(userPhoneQuery);
                    if (user)
                        throw new Error('phone already exists');
                    else
                        return true
                })
        ];
    },
    //signup logic 
    async signUp(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            }
            
            if (req.body.type == "PROVIDER")
                req.body.active = false

            let createdUser = await User.create(req.body);
            res.status(201).send({ user: createdUser, token: generateToken(createdUser.id) });
        } catch (err) {
            next(err);
        }
    },
    //sign in logic 
    async signin(req, res, next) {
        let user = req.user; // Passport
        console.log(user.type)
        res.send({ user, token: generateToken(user.id) });
    },
    async completedOrderOfOneUser(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            let page = req.query.page || 1;
            let allOrders = await Order.find({
                $and: [
                    { customer: req.params.userId },
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
    async unCompletedOrderOfOneUser(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            let page = req.query.page || 1;
            let allOrders = await Order.find({
                $and: [
                    { customer: req.params.userId },
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
    //fetch some statistics about order 
    async countOrdersOfCustomer(req, res, next) {
        try {
            let customerId = req.params.customerId;
            let customerDetails = await User.findById(customerId);
            let countOfAllOrder = await Order.count({ customer: customerId });

            let queryComplete = {};
            queryComplete.status = "delivered";
            queryComplete.customer = customerId;
            let countOfCompleted = await Order.count(queryComplete);

            let queryOfPending = {}
            queryOfPending.status = "pendding";
            queryOfPending.customer = customerId;
            let countOfPendding = await Order.count(queryOfPending);

            let queryOfRefuse = {}
            queryOfRefuse.status = "rejected";
            queryOfRefuse.customer = customerId;
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
    //update profile
    async updateProfile(req, res, next) {
        try {
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return res.status(404).end();
            if (req.file)
                req.body.img = await toImgUrl(req.file)
            let newUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
            return res.status(200).json(newUser);
        } catch (err) {
            next(err)
        }
    },
    //fetch user details 
    async reriveUserDetails(req, res, next) {
        try {
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return res.status(404).end();
            return res.status(200).json(userDetails);
        } catch (err) {
            next(err)
        }
    },

}