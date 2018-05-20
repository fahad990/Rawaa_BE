import Cartona from '../../models/cartona.model';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import { toImgUrl } from '../../utils/index'
import ApiError from '../../helpers/ApiError'
import ApiResponse from '../../helpers/ApiResponse'
import User from '../../models/user.model'

export default {
    validateBody(isUpdate = false) {
        return [
            body("numberOfBottles").exists().withMessage("numberOfBottles is required"),
            body("sizeOfBottles").exists().withMessage("sizeOfBottles is required"),
            // body("img").exists().withMessage("img is required"),
            body("price").exists().withMessage("price is required"),
        ];
    },
    //create new cartona product
    async createCartona(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (!(req.user.type == "PROVIDER")) {
                next(new ApiError(403, 'not provider user'))
            }
            let userDetails = await User.findById(req.user.id);
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            } else {
                next(new ApiError(422, 'img is required'))
            }
            req.body.user = req.user._id
            let newDoc = await Cartona.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },
    //retrive all cartona products 
    async allCartones(req, res, next) {
        const limit = parseInt(req.query.limit) || 20;
        const page = req.query.page || 1;
        let query = {}
        if (req.query.typeOfSize)
            query.typeOfSize = req.query.typeOfSize

        if (req.query.available)
            query.available = req.query.available
        try {
            let docsCount = await Cartona.count(query)
            let allDocs = await Cartona.find(query).populate('user')
                .skip((page - 1) * limit).limit(limit)
                .sort({ creationDate: -1 })
            return res.send(new ApiResponse(
                allDocs,
                page,
                Math.ceil(docsCount / limit),
                limit,
                docsCount,
                req
            ))
        } catch (err) {
            next(err)
        }
    },
    //update cartone
    async updateCartona(req, res, next) {
        const cartonId = req.params.cartonId;
        try {
            let carton = await Cartona.findById(cartonId)
            if (!(req.user.id == carton.user)) {
                return next(new ApiError(403, "not have access to this resourse"))
            }

            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            }
            await Cartona.update({ _id: cartonId }, {
                $set: {
                    numberOfBottles: req.body.numberOfBottles || carton.numberOfBottles,
                    sizeOfBottles: req.body.sizeOfBottles || carton.sizeOfBottles,
                    typeOfSize: req.body.typeOfSize || carton.typeOfSize,
                    price: req.body.price || carton.price,
                    available: req.body.available || carton.available,
                    img: req.body.img || carton.img,
                    minimumNumberOnOrder: req.body.minimumNumberOnOrder || carton.minimumNumberOnOrder,
                }
            })
            let newCartonw = await Cartona.findById(carton)
                .populate('user')
            return res.status(200).json(newCartonw)
        } catch (err) {
            next(err)
        }
    },

    //retrive one cartone details 
    async cartonDetails(req, res, next) {
        try {
            if (!req.params.cartonId)
                next(new ApiError(422, "missed cartonId"))
            const cartonId = req.params.cartonId;
            let carton = await Cartona.findById(cartonId).populate('user')
            if (!carton) {
                return res.status(404).end();
            }
            return res.status(200).json(carton)
        } catch (err) {
            next
        }
    },
    //retrive all galons under one provider 
    async cartonsOfOneProvider(req, res, next) {
        const limit = parseInt(req.query.limit) || 200;
        const page = req.query.page || 1;
        const userId = req.params.userId;
        try {
            let query = {}
            if (req.query.available)
                query.available = req.query.available
            query.user = userId
            let docsCount = await Cartona.count(query)
            let allDocs = await Cartona.find(query)
                .populate('user')
                .skip((page - 1) * limit).limit(limit).sort({ creationDate: -1 })
            return res.send(new ApiResponse(
                allDocs,
                page,
                Math.ceil(docsCount / limit),
                limit,
                docsCount,
                req
            ))
        } catch (err) {
            next(err)
        }
    },
    //make carttons available
    async updateAvalaibiltyOfCarton(req, res, next) {
        try {
            let cartonId = req.params.cartonId;
            let cartonDetails = await Cartona.findById(cartonId);
            if (!cartonDetails)
                return res.status(404).end();

            if (cartonDetails.available == true)
                cartonDetails.available = false
            else
                cartonDetails.available = true

            await cartonDetails.save();
            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },

}
