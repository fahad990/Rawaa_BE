import express from 'express';
import passport from 'passport';
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
import ProviderController from '../controllers/provider.controller'
const requireSignIn = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/:providerId/orders/un-completed')
    .get(requireAuth, ProviderController.unCompletedOrderOfOneProvider)


router.route('/:providerId/orders/completed')
    .get(requireAuth, ProviderController.completedOrderOfOneProvider)

export default router;