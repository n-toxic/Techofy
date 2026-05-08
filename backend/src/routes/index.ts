import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import instancesRouter from "./instances.js";
import supportRouter from "./support.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(instancesRouter);
router.use(supportRouter);
router.use(adminRouter);

export default router;
