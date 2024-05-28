import {Router} from "express"
import {home, createRoom, bookRoom, findRoom, roomInfo, customerInfo, customerRoomInfo, Error404} from "../controllers/booking.js"

const route = Router()

// Routes
route.get("/", home)
route.post("/create", createRoom)
route.post("/find", findRoom)
route.post("/booking", bookRoom)
route.get("/room-info", roomInfo)
route.get("/customers", customerInfo)
route.post("/customer/:name", customerRoomInfo)
route.get("*", Error404)

export default route