import connectDB from "./DB/connection.js";
import authRouter from "./Modules/auth/auth.controller.js";
import userRouter from "./Modules/user/user.controller.js";
import postRouter from "./Modules/post/post.controller.js";
import commentRouter from "./Modules/comment/comment.controller.js";
import adminRouter from "./Modules/admin/admin.controller.js";
import cors from "cors";
import morgan from "morgan";
const bootstrap = async (app,express) => {
    await connectDB();

    app.use(cors());
    app.use(morgan("combined"));
    app.use(express.json());
    app.use("/uploads",express.static("uploads"));
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter);
    app.use("/comment",commentRouter);
    app.use("/admin",adminRouter);
    app.use((error,req,res,next)=>
    {
        const status = error.cause || 500;
        return res.status(status).json({success:false, error: error.message, stack: error.stack});
    });

}

export default bootstrap


