import moment from "moment";

// Function to parse date and time with validation
const dateParser = (date, time) => {
    try 
    {
        if (!validateDate(date) || !validateTime(time)) 
        {
            return {status: 400, message: "Invalid date format. Please use Date: YYYY-MM-DD , 24hrs Time: 10:00 "};
        }else
        {
            const utcDate = moment(date + ' ' + time);
            let formatDate = moment(utcDate, moment.ISO_8601, true)
            return formatDate;
        }
    } catch (error) 
    {
        console.log("Error: ", error)
        return  { status: 400, message: error.message }
    }
}

const validateDate = (date) => {
    const validateDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return validateDateRegex.test(date)
}

const validateTime = (time) => {
    const validateTimeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(?: (AM|PM))?$/
    return validateTimeRegex.test(time);
};

// Function to check if a date object is valid Moment object
const isValidDate = (dateObject) => {
    return moment.isMoment(dateObject) && dateObject.isValid();
};


// Function to check if a date is before today's date
const isDateBefore = (date) => {
    try 
    {
        var now = moment().format("YYYY-MM-DD");
        return date.isBefore(now)
    } catch (error) 
    {
        return { status : 400, message: error.message };
    }
}

export {dateParser, isValidDate, isDateBefore}