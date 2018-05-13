import CartonaController from '../../controllers/cartona/cartona.controller'
import express from 'express';
import { multerSaveTo } from '../../services/multer';
import cartonaController from '../../controllers/cartona/cartona.controller';
const router = express.Router();

router.route('/')
    .post(
    multerSaveTo('cartona').single('img'),
    cartonaController.validateBody(),
    CartonaController.createCartona
    )

    .get(CartonaController.allCartones)

router.route('/:cartonId')
    .put(multerSaveTo('cartona').single('img'),
    CartonaController.updateCartona)

    .get(CartonaController.cartonDetails)
router.route('/:cartonId/available')
    .put(cartonaController.updateAvalaibiltyOfCarton)
export default router;


