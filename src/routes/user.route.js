import UserController from '../controllers/user.controller'
import galonController from '../controllers/galon/galon.controller'
import cartonController from '../controllers/cartona/cartona.controller'
import NotificationController from '../controllers/notification.controller'
import express from 'express';
import passport from 'passport';
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
import pushRoute from "./push-notification.route";
import { checkBlockUser } from '../helpers/check-block-user';
const requireSignIn = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.use(pushRoute);

router.route('/signup')
    .post(
    multerSaveTo('users').single('img'),
    UserController.validateBody(),
    UserController.signUp
    )

router.post("/signin", requireSignIn, UserController.signin);

router.route("/users/:userId/galons")
    .get(
    requireAuth,
    galonController.galonsOfOneProvider)

router.route('/users/:userId')
    .put(
    requireAuth,
    multerSaveTo('users').single('img'),
    UserController.updateProfile)
    .get(requireAuth, UserController.reriveUserDetails)

router.route("/users/:userId/cartons")
    .get(
    requireAuth,
    checkBlockUser,
    cartonController.cartonsOfOneProvider)

router.route("/users/:userId/notification")
    .get(requireAuth, checkBlockUser, NotificationController.retriveAllNotification)

router.route('/users/:userId/orders/completed')
    .get(requireAuth, checkBlockUser, UserController.completedOrderOfOneUser)

router.route('/users/:userId/orders/un-completed')
    .get(requireAuth, checkBlockUser, UserController.unCompletedOrderOfOneUser)

export default router;


