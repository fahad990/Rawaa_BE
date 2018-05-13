import UserController from '../controllers/user.controller'
import galonController from '../controllers/galon/galon.controller'
import cartonController from '../controllers/cartona/cartona.controller'
import express from 'express';
import passport from 'passport';
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
import pushRoute from "./push-notification.route";
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

router.route("/users/:userId/cartons")
    .get(
    requireAuth,
    cartonController.cartonsOfOneProvider)

router.route('/users/:userId/orders/completed')
    .get(requireAuth, UserController.completedOrderOfOneUser)
router.route('/users/:userId/orders/un-completed')
    .get(requireAuth, UserController.unCompletedOrderOfOneUser)
export default router;


