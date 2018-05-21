import User from '../models/user.model';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import { toImgUrl } from '../utils/index'
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'
import nodemailer from 'nodemailer'


export default {
    async forgetPassword(req, res, next) {
        try {
            let phone = req.body.phone;
            let userDetails = await User.findOne({ phone: phone });
            if (!userDetails)
                return res.status(404).end();
            let email = userDetails.email;

            //generate code 
            let code = Math.floor((Math.random() * 10000) + 1)
            userDetails.code = code;
            await userDetails.save();

            //send email 
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rawaa.app@gmail.com',
                    pass: 'rawaa123456789'
                }
            });

            let mailOptions = {
                from: 'rawaa.app@gmail.com',
                to: `${email}`,
                subject: 'Confirmation Code',
                text: `Hello Dear, 
                Please use this code  ${code}  to reset your password
                Thanks advanced`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error)

                    return console.log(error)
                return res.status(200).json(info)
            })
        } catch (err) {
            next(err)
        }
    },

    //mach code 
    async matchCodeOfUserAndResetPass(req, res, next) {
        try {
            if (!req.body.code)
                return next(new ApiError(422, 'code is required'))
            let code = req.body.code;
            if (!req.body.email)
                return next(new ApiError(422, 'email is required'))
            let email = req.body.email;
            if (!req.body.newPassword)
                return next(new ApiError(422, 'new password is required'))
            console.log(email)
            let userDetails = await User.findOne({ email: email });
            console.log(userDetails)
            if (!userDetails)
                return res.status(404).end();

            let userCode = userDetails.code;
            if (!(code == userCode))
                return res.status(400).json({
                    "message": "Invalid code"
                })
            //change password    
            userDetails.password = req.body.newPassword;
            await userDetails.save();

            return res.status(204).end();
        } catch (err) {
            next(err)
        }
    },



}
