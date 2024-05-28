import fs from 'fs'

const readJSON = (filePath) => {
    try {
        let readJson = fs.readFileSync(filePath, "utf8")
        let parsedData = JSON.parse(readJson)
        return parsedData
    } catch (error) {
        console.log("Error: ", error)
    }
}

const writeJSON = (filePath, data) => {
    try{
        fs.writeFileSync(filePath, JSON.stringify(data))
        return {
            status: 200, 
            message: "Booked Succesfully..."
        }
    }catch(err)
    {
        console.log("Error: ", err)
        return  {
            status: 400, 
            message: "Booking Failed..."
        }
    }
}

export {readJSON, writeJSON}