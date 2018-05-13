
import User from "../models/user.model";
import * as _ from "lodash";
import ApiError from '../helpers/ApiError';

export default {


    async subscribe(req, res, next) {

        let user = req.user;
        user = await User.findById(user.id) ;

        let token = req.body.token;

        if (!token)
            return next(new ApiError(422, "token is required"));

        user.pushTokens.push(token);
        await user.save();

        res.status(204).end();

    },

    async update(req, res, next) {

        let user = req.user;
        user = await User.findById(user.id) ;

        let oldToken = req.body.oldToken;
        let newToken = req.body.newToken;

        if (!oldToken)
            return next(new ApiError(422, "oldToken is required"));

        if (!newToken)
            return next(new ApiError(422, "newToken is required"));

        if (!user.pushTokens.includes(oldToken))
            return next(new ApiError(422, "oldToken not exists in this user "));

        let tokens = { ..._.without(user.pushTokens, oldToken), newToken };
        user.pushTokens = tokens;

        await user.save();

        res.status(204).end();
    },


    async unsubscribe(req, res, next) {

        let user = req.user;
        user = await User.findById(user.id) ;

        let token = req.body.token;
        if (!token)
            return next(new ApiError(422, "token is required"));

        let tokens = _.without(user.pushTokens, token);
        user.pushTokens = tokens;

        await user.save();
        res.status(204).end();
    }

    
}
