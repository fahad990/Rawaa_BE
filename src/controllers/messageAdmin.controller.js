import Message from '../models/message-admin.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {
    async createMessage(req, res, next) {
        try {
            let targetId = req.params.userId;
            let userId = req.user.id;

            let object = {
                user: userId,
                text: req.body.text,
                targetUser: targetId
            }
            let newMessage = await Message.create(object);
            return res.status(201).json(newMessage);
        } catch (err) {
            next(err)
        }
    },
    //retrive all messages
    async allMessageOfOneUser(req, res, next) {
        try {
            let userId = req.params.userId
            let allDocs = await Message.find({ targetUser: userId })
                .populate('targetUser')
                .populate('user')
            return res.status(200).json(allDocs)
        } catch (err) {
            next(err)
        }
    },
}