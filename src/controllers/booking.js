import moment from "moment";
import fs from 'fs'
import {dateParser, isValidDate} from "../utils/dateParser.js";
import { readJSON, writeJSON } from "../utils/jsonParser.js";
import findMatchingRoom from "../utils/getRoom.js";

// JSON file Path
const filePath = "./src/data/customerData.json"

// JSON file has data or not
const existingData = fs.readFileSync(filePath, 'utf8');
let data = existingData ? JSON.parse(existingData) : [];


let hall = [
    {
        roomID: 1,
        roomNo: 101,
        roomName: "Deluxe",
        amenities: ["TV", "AC", "Heater"],
        capacity: 100,
        price: 500,
    },
    {
        roomID: 2,
        roomNo: 102,
        roomName: "Standard",
        amenities: ["TV", "Non-AC", "Heater"],
        capacity: 50,
        price: 250,
    },
    {
        roomID: 3,
        roomNo: 103,
        roomName: "Extra Deluxe",
        amenities: ["TV", "AC", "Non-Heater"],
        capacity: 150,
        price: 750,
    },
    {
        roomID: 4,
        roomNo: 104,
        roomName: "city Hall",
        amenities: ["TV", "AC", "Heater"],
        capacity: 250,
        price: 1250,
    },
    {
        roomID: 5,
        roomNo: 105,
        roomName: "Banquet hall",
        amenities: ["TV", "Non-AC", "Heater"],
        capacity: 200,
        price: 1000,
    },
]

/**
 * @request GET
 * @endpoint /
 */
const home = (req, res) => {
    res.send(`<h2 style="text-align: center">Welcome to hall booking. Server is running. Please check the API in postman<h2>`)
}

/**
 * @desc Create new room
 * @request POST
 * @endpoint /create
 */
const createRoom = (req, res) => {
    let {roomNo, ...rest} = req.body

    let isRoomExist = hall.some(room => room.roomNo === roomNo)
    if (isRoomExist) 
    {
        return res.status(400).send({message: "The given room is already Exist. Please choose different room Number."})
    }
    let newRoom = {
        roomID: hall.length + 1,
        ...rest,
        roomNo
    };
    
    hall.push(newRoom)
    res.status(200).send({ message: `New Room Created Successfully`, hall });
}


/**
 * @desc To find available room
 * @request POST
 * @endpoint /find
 */
const findRoom =(req, res) => {
    try {
        const {date, startTime, endTime, capacityRange} = req.body
    
        //find the hall
        const roomSeaching = findMatchingRoom(date, startTime, endTime, capacityRange, filePath, hall)

        res.status(roomSeaching.status).send({ Message: roomSeaching })
    } catch (error) 
    {
        console.error("Error finding room:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

/**
 * @desc Book a room by using room number from the /find
 * @request POST
 * @endpoint /booking
 */

const bookRoom = (req, res) => {
    try 
    {
        let {customerName, date, startTime, endTime, roomNo} = req.body;
        // Parsing date and time using moment
        const start = dateParser(date, startTime);
        const end = dateParser(date, endTime);

        // Validate the parsed date
        if (!isValidDate(start) || !isValidDate(end)) 
        {
            return res.status(400).send({ message: end.message });
        }

        // Calculate total hours
        let totalTime = end.diff(start, "minutes") / 60;

        let findSelectedRoom = hall.find(hall => hall.roomNo === roomNo)
        if (!findSelectedRoom) 
        {
            return res.status(400).send({ message: "Room not found. Please Enter the correct room number." });
        }

        let cost = findSelectedRoom.price * totalTime
        // Read json file
        let readJson = readJSON(filePath)

        const userData = {
            customerName,
            bookingID: readJson.length + 1,
            date,
            startTime,
            endTime,
            roomNo,
            price: cost,
            status: "booked",
            createdAt: moment().toISOString() 
        }

        const newData = [...data, userData]
        data = newData;

        // Insert booking data
        let writeJson = writeJSON(filePath, data)
        res.status(writeJson.status).send({message: writeJson.message})
    } catch (error) 
    {
        console.error("Error in Booking:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

/**
 * @desc Getting booked room details with booked data
 * @request GET
 * @endpoint /room-info
 */

const roomInfo = (req, res) => {
    try 
    {
        let readJson = readJSON(filePath)
        let roomDetails = readJson.map((booked)=> {
            let room = hall.find(room => room.roomNo === booked.roomNo)
            return {
                roomName: room.roomName,
                bookingStaus: booked.status,
                customerName: booked.customerName,
                date: booked.date,
                startTime: booked.startTime,
                endTime: booked.endTime
            }
        })
        res.status(200).json({message: "Succesfully fetched Room Details:", roomDetails})
    } catch (error) 
    {
        console.error("Error room Details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

/**
 * @desc Getting customer details with booked data
 * @request GET
 * @endpoint /customers
 */
const customerInfo = (req, res) => {
    try 
    {
        const customerDetails = readJSON(filePath)
        res.status(200).send({message: "Succesfully fetched customer details....", customerDetails})
    } catch (error) {
        console.error("Error customers Details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

/**
 * @desc Getting details from customer
 * @request POST
 * @endpoint /customer/:name
 */
const customerRoomInfo = (req, res) => {
    try {
        let {name} = req.params;
        let readJson = readJSON(filePath)
        let customer = readJson.filter((customer => customer.customerName == name))

        // Handle customer not found
        if(customer.length === 0)
        {
            res.status(404).send({message: `Customer not found -- ${name}`})
        }

        // Process customer data
        let customerRoomDetail = customer.map(customer => {
            let room = hall.find(room => room.roomNo === customer.roomNo)
            return {
                RoomName: room.roomName,
                customerName: customer.customerName,
                date: customer.date,
                startTime: customer.startTime,
                endTime: customer.endTime,
                bookingId: customer.bookingID,
                bookingDate: customer.createdAt,
                bookingStatus: customer.status
            }
        })
        res.status(200).send({message: "Succesfully fetched customer and Room Details:", customerRoomDetail})
    } catch (error) {
        console.error("Error customer and room Details:", error);
        res.status(500).send({ message: "Internal server error." });
    }
}

// Error page
const Error404 = (req, res) => {
    res.status(404).send({message: "404 Page not found!!"})
}

export {home, createRoom, bookRoom, findRoom, roomInfo, customerInfo, customerRoomInfo, Error404}