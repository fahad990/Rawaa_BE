import GalonController from '../../controllers/galon/galon.controller'
import express from 'express';
import { multerSaveTo } from '../../services/multer';
import cartonaController from '../../controllers/cartona/cartona.controller';
const router = express.Router();

router.route('/')
    .post(
    multerSaveTo('galons').single('img'),
    GalonController.validateBody(),
    GalonController.createGalon
    )
    .get(GalonController.allGalons)

router.route('/:galonId')
    .get(GalonController.galonDetails)

    .put(
    multerSaveTo('galons').single('img'),
    GalonController.updateGalon)

router.route('/:galonId/available')
    .put(GalonController.updateAvalaibiltyOfGalons)
export default router;