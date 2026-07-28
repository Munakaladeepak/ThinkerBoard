import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv"

// Rate limiter: 5 requests per 10 seconds (sliding window)
dotenv.config();

const ratelimit= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter:Ratelimit.slidingWindow(30,"60 s"),
})

export default ratelimit