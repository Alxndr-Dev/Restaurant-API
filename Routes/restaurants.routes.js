import { Router } from "express";
import { prueba, makeReservation, reservationsTomorrow } from "../Controllers/restaurantsControllers.js";


const router = Router();

router.get("/api/prueba", prueba);

router.post("/api/reservations", makeReservation);

router.get("/api/reservations/tomorrow", reservationsTomorrow);



export default router;