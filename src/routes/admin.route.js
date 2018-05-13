import AdminController from '../controllers/admin.controller';
import ProviderController from '../controllers/provider.controller';
import userController from '../controllers/user.controller';
import MessageController from '../controllers/messageAdmin.controller'
import express from 'express';
import passport from 'passport';
const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.route('/users')
    .get(
    requireAuth,
    AdminController.allUsers)
router.route('/counts-numbers')
    .get(AdminController.adminStatisttics)
router.route('/price-delivir-km')
    .post(requireAuth, AdminController.createPriceOfKilloMeter)

router.route('/orders/recent')
    .get(AdminController.getRecentOrders)

router.route('/price-delivir-km/:id')
    .put(requireAuth, AdminController.updatePriceOfKilloMeter)

router.route('/users/:userId/de-active')
    .put(requireAuth, AdminController.deactiveUser)

router.route('/users/:userId/active')
    .put(requireAuth, AdminController.activeUser)

router.route('/users/:userId/messages')
    .post(requireAuth, MessageController.createMessage)
    .get(requireAuth, MessageController.allMessageOfOneUser)

router.route('/providers/:providerId/count-orders')
    .get(ProviderController.countOrdersOfProvider)

router.route('/users/:customerId/count-orders')
    .get(userController.countOrdersOfCustomer)



export default router;