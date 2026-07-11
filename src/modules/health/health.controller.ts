import type { Request, Response } from "express";
import healthService from "./health.service.js";

class HealthController {
    getHealth(req: Request, res : Response) {
        const result = healthService.getHealth();
        res.json(result);   
    }
}

export default new HealthController();