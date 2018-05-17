import OrderController from '../controllers/order.controller';
import express from 'express';
import passport from 'passport';
import { checkBlockUser } from '../helpers/check-block-user'
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/users/:userId/orders')
    .post(
    requireAuth,
    checkBlockUser,
    OrderController.validateBody(),
    OrderController.createOrder)

router.route('/providers/:providerId/orders')
    .get(requireAuth,
    checkBlockUser,
    OrderController.allOrdersOfProvider)
//retrive one order details
router.route('/orders/:orderId')
    .get(requireAuth,
    checkBlockUser,
    OrderController.orderDetails)
//accept order 
router.route('/orders/:orderId/accept')
    .put(requireAuth,
    checkBlockUser,
    OrderController.acceptOrder)
//refuse order 
router.route('/orders/:orderId/refuse')
    .put(requireAuth,
    checkBlockUser,
    OrderController.refuseOrder)

router.route('/orders/:orderId/refuse-reasone')
    .put(requireAuth,
    checkBlockUser,
    OrderController.sendReasoneOfRefuseOrder)

//on the way order 
router.route('/orders/:orderId/on-the-Way')
    .put(requireAuth,
    checkBlockUser,
    OrderController.makeOrderOnDiliver)
//make order done 
router.route('/orders/:orderId/delivered')
    .put(requireAuth,
    checkBlockUser,
    OrderController.makeOrderDone)

//get distance between 2 point locations
router.route('/orders/pric-distance')
    .post(
    requireAuth,
    checkBlockUser,
    OrderController.validateBodyOfCalulatePrice(),
    OrderController.calculatePriceOfDistance)
export default router;