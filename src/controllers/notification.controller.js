import NotificationModel from '../models/notification.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {
   //retrive all notification of one custome 
   async retriveAllNotification(req, res, next){
    try {
        let userId = req.params.userId;
        
    } catch (err) {
        next(err)
    }
   },
}