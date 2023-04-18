import { Router } from "express";
import { userCreation } from "../controller/user/userCreation";
export const router = Router();
// 

 router.post("/api/v1/create-user", userCreation);
// router.delete("/api/v1/delete-class/:id", deleteClass);

