import { readJSON } from "./jsonParser.js";
import {dateParser, isValidDate, isDateBefore} from "./dateParser.js";
import moment from "moment";


// Finds a room matching the specified criteria.
const findMatchingRoom =(date, startTime, endTime, capacityRange, filePath, hall) => {
    try {
        const parseDate = dateParser(date, startTime);

        // Validate date
        if (!isValidDate(parseDate)) 
        {
            return {  status: 400, message: parseDate.message };
        }
        // Validate time
        if (isDateBefore(parseDate)) 
        {
            return { status: 400, message: "Booking date must be today or in the future " }
        }

        // Read the Json file
        let bookedData = readJSON(filePath)
        
        let isRoomBookedSameDate = bookedData.some(booking => booking.date === date) 
        if (isRoomBookedSameDate) {
            //TODO: Time Based Booking 
            const available = checkTimeAvailability(bookedData, date, startTime, endTime);
            if(available[0])
            {
                return findAvailableRooms("Room is available and please use the room number in booking form", capacityRange, hall)
            }
            else{
                return {status: 400, message: "Room already booked. Please choose different time"}
            }
        }else
        {
            return findAvailableRooms("Room is available and please use the room number in booking form", capacityRange, hall)
        }
    } catch (error) {
        console.error("Error reading booking data:", error);
        return { status: 500, message: "Internal server error. Please try again later." };
    } 
}

// Checks if a room is available within a specific time range on a given date.
const checkTimeAvailability = (bookedData, date, startTime, endTime) => {
    let isDateAvailable = bookedData.filter(booking => booking.date === date)
    .map(val => {
        const format = 'hh:mm:ss';
        // Format the time
        const start = moment(startTime, format);
        const end = moment(endTime, format);
        const beforeTime = moment(val.startTime, format);
        const afterTime = moment(val.endTime, format);
        // checking input time is between or equal to the same date
        let isStartTimeBetween = moment(start).isBetween(beforeTime, afterTime) || start.isSame(beforeTime)
        let isEndTimeBetween  = moment(end).isBetween(beforeTime, afterTime) || end.isSame(afterTime)
        const isAvailable = !isStartTimeBetween && !isEndTimeBetween;
        return isAvailable ;
    })

    return isDateAvailable
}

// Finds available rooms based on capacity range.
const findAvailableRooms = (message, capacityRange, hall) => {
    const [low, high] = (capacityRange).split("-").map(Number);
    let availableRooms   = hall.filter((val) => val.capacity <= high && val.capacity >= low)

    if(availableRooms .length > 0)
    {
        let roomDetails = availableRooms .map(val => {
            return {
                roomNo : val.roomNo, 
                price: val.price
            }
        });
        return { status: 200, message, roomDetails } 
    }else
    {
        return  { status: 400, message: "No rooms available for the specified criteria." }
    }
}

export default findMatchingRoom