import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import instancesRouter from "./instances";
import supportRouter from "./support";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(instancesRouter);
router.use(supportRouter);
router.use(adminRouter);

export default router;
