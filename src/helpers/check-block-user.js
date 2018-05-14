import User from '../models/user.model';
import ApiError from './ApiError'

export async function checkBlockUser(req, res, next) {
    try {
        let userId = req.user.id;
        let userDettails = await User.findById(userId);
        if (userDettails.active == false) {
            console.log('mmmm')
            return next(new ApiError(403, 'de-active user'))
        } else {
            console.log('cdcdc');
            next();
        }

    } catch (err) {
        next(err)
    }

}