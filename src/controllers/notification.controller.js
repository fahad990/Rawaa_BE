import NotificationModel from '../models/notification.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {
    //retrive all notification of one customer
    async retriveAllNotification(req, res, next) {
        try {
            let userId = req.params.userId;
            let allNotificattion = await NotificationModel.find({ targetUser: userId })
                .populate({
                    path: 'order',
                    populate: { path: 'customer', model: 'user' }
                }).sort({ creationDate: -1 })
            return res.status(200).json(allNotificattion)
        } catch (err) {
            next(err)
        }
    },
}