import ForgetPasswordController from '../controllers/forget-pass.controller';
import User from '../models/user.model';
import express from 'express';

const router = express.Router();

router.route('/forget-password')
    .put(ForgetPasswordController.forgetPassword)

router.route('/password-code-match')
    .put(ForgetPasswordController.matchCodeOfUserAndResetPass)

export default router;