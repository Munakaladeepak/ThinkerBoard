import ratelimit from "../config/upstash.js";

const rateLimiter  = async (req,res,next)=>{
    try{
        const clientIp = req.ip || req.headers['x-forwarded-for'] || "global_limit";
        const {success} = await ratelimit.limit(clientIp);
        if(!success){
            return res.status(429).json({
                message:"Too many requests, please try again later"
            });
        }
        next();

    }catch(error){
        console.log("Rate Limit error: ", error);
        next(error);
    }
}

export default rateLimiter