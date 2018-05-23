import Galon from '../../models/galon.model';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import { toImgUrl } from '../../utils/index'
import ApiError from '../../helpers/ApiError'
import ApiResponse from '../../helpers/ApiResponse'


export default {

    validateBody(isUpdate = false) {
        return [
            body("size").exists().withMessage("numberOfBottles is required"),
            body("priceOfBuying").exists().withMessage("priceOfBuying is required")
        ];
    },
    //create new galon
    async createGalon(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (!(req.user.type == "PROVIDER")) {
                next(new ApiError(403, 'not provider user'))
            }
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            } else {
                next(new ApiError(422, 'img is required'))
            }
            req.body.user = req.user._id
            let newDoc = await Galon.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },

    //retrive all galons 
    async allGalons(req, res, next) {
        const limit = parseInt(req.query.limit) || 200;
        const page = req.query.page || 1;
        let query = {}
        try {
            query.available = true
            let docsCount = await Galon.count(query)
            let allDocs = await Galon.find(query).populate('user')
                .skip((page * limit) - limit).limit(limit).sort({ creationDate: -1 });
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

    //retrive one galone details 
    async galonDetails(req, res, next) {
        const galonId = req.params.galonId;
        let doc = await Galon.findById(galonId);
        if (!doc)
            return next(new ApiError(404));
        return res.status(200).json(doc);
    },

    //update one galon details 
    async updateGalon(req, res, next) {
        const galonId = req.params.galonId;
        try {
            let galon = await Galon.findById(galonId)
            if (!(req.user.id == galon.user)) {
                return next(new ApiError(403, "not have access to this resourse"))
            }
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            }
            await Galon.update({ _id: galonId }, {
                $set: {
                    size: req.body.size || galon.size,
                    img: req.body.img || galon.img,
                    available: req.body.available || galon.available,
                    priceOfBuying: req.body.priceOfBuying || galon.priceOfBuying,
                    priceOfSubstitution: req.body.priceOfSubstitution || galon.priceOfSubstitution,
                    minimumNumberOnOrder: req.body.minimumNumberOnOrder || galon.minimumNumberOnOrder,
                }
            })
            let newGalon = await Galon.findById(galonId)
                .populate('user')
            return res.status(200).json(newGalon)
        } catch (err) {
            next(err)
        }
    },

    //retrive all galons under one provider 
    async galonsOfOneProvider(req, res, next) {
        const limit = parseInt(req.query.limit) || 200;
        const page = req.query.page || 1;
        const userId = req.params.userId;
        try {
            let query = {}
            query.available = true
            query.user = userId
            let docsCount = await Galon.count(query)
            let allDocs = await Galon.find(query)
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
    async updateAvalaibiltyOfGalons(req, res, next) {
        try {
            let galonId = req.params.galonId;
            let galonDetails = await Galon.findById(galonId);
            if (!galonDetails)
                return res.status(404).end();

            if (galonDetails.available == true)
                galonDetails.available = false
            else
                galonDetails.available = true

            await galonDetails.save();
            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },


}