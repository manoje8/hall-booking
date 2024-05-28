# Hall Booking API

Write an API for Hall Booking Application using node JS and its framework Express JS. This API for a basic hall booking system. It allows users to create rooms, find rooms , book rooms and view room and customer information.

**Functionalities:**
- **Home:** Displays a welcome message.
- **Create Room:** Allows creating new rooms with details.
- **Find Room:** Searches for available rooms based on date, time, and capacity.
- **Book Room:** Books a room for a customer based on provided details.
- **Room Info:** Retrieves information about all booked rooms.
- **Customer Info:** Retrieves information about all customers.
- **Customer Room Info:** Retrieves booking details for a specific customer.
- **Error 404:** Handles requests for non-existent endpoints.

**Render Deployment**
Website URL: [Hall Booking](https://hall-booking-tyfl.onrender.com/)

**API Documentation**
[Click here to view API Documentation](https://documenter.getpostman.com/view/35311314/2sA3QsBYN7)

**Technologies Used**
- Node.js
- Express.js
- `fs` module(for file system operation)
- `moment` module (for date formatting)
- body-parse module
- cors module
- mogan module(logging middleware)
## Installation and Setup

1. Clone the repository:
```
git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name
```

2. Install dependencies:
```
npm install express nodemon moment cors body-parser morgan
```

3. Start the development server:
```
npm run dev
```

The server will start on port `3000` by default. You can access the application routes in your browser.

