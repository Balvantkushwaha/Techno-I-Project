import express from "express";

// Feature routes import karein
// import userAuthRoutes from "./userAuth/userRoutes.js";
// import productRoutes from "./products/productRoutes.js";
// import orderRoutes from "./orders/orderRoutes.js";


// globalRoutes import here

const mainRouter = express.Router();

//  Feature Routes mapping
// mainRouter.use("/auth", userAuthRoutes);
// mainRouter.use("/products", productRoutes);
// mainRouter.use("/orders", orderRoutes);


//Global routes (yahan add karein)
mainRouter.get("/health",(req,res)=>{
    res.send("System Ok...");
})

export default mainRouter;