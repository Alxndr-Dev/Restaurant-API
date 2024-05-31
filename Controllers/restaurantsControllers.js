import fs from 'fs';


//READ JSON FILES
const data = fs.readFileSync('./Tables.json')
const tables = JSON.parse(data)


const dataReservations = fs.readFileSync('./reservations.json')
const reservations = JSON.parse(dataReservations);


// API REST TEST
const prueba = async (req, res) => {

    res.send("PRUEBA DE API REST");
}


//RESERVATIONS IN THE ITALIAN CORNER
//POST
const makeReservation = async(req, res) => {

    try {
        
        const {id, maxPeople, qtyPeople, date, time} = req.body;

        const newReservation = {
            id,
            maxPeople,
            qtyPeople,
            date,
            time
        };

        //Save the time of the reservation
        const rsvTime = newReservation.time;

        //Save the number of people of the reservation
        const rsvQtyPeople = newReservation.qtyPeople;        

        /*
        I supose the restauran is open from 10:00 to 23:00
        in this case the restaurant has 13 hours available
        1 is 10:00, 2 is 11:00 and 3 is 12:00 and so on.
        I supose one reservation is for 1 hour.
        I supose in the front end the user can select the time of the reservation.
        */
        const hrsFree = [1,2,3,4,5,6,7,8,9,10,11,12,13];

        const rsvHour = hrsFree[rsvTime];

        //This is for you can't make a reservation in the past or in the same day
        const actDate = new Date(Date.now());


        //Obtain the day of the reservation
        const numDay = new Date(newReservation.date);
        const day = numDay.getDay();
        const weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        //This is the day of the reservation
        const weekDays = weekDay[day];
        const weekDayRsv = weekDays.toLowerCase();

    
        //Verify if the day of the reservation is greater than the actual day
        if(numDay >= actDate){
        
            if(reservations.some(reservation => reservation.date === newReservation.date && reservation.time === newReservation.time && reservation.id === newReservation.id)){
                return res.status(400).json({message: "The table is already reserved"});
            } else {
                if(hrsFree.includes(rsvHour)){
                    if(rsvQtyPeople > newReservation.maxPeople){
                        return res.status(400).json({message: "The table is too small for the number of people"});
                }else {
                    reservations.push(newReservation);
                    fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2), (err)=>{
                    if(err) throw err;
            
                    });
                    res.status(200).json({message: "Reservation created"});
                        }
                }else{
                    return res.status(400).json({message: "The time is not available"});
                }}
        }else{
            return res.status(400).json({message: "You can't make a reservation in the past or in the same day"});
        }


        

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

//GET
//RESERVATIONS FOR TOMORROW
const reservationsTomorrow = async(req, res) => {

    try {
        const date = new Date(Date.now());
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        
        
        const tablesAvailable = tables.filter(table => {
            const tableReservations = reservations.filter(reservation => reservation.date === tomorrowDate && reservation.id === table.id);
            const totalReservedSeats = tableReservations.reduce((acc, curr) => acc + curr.qtyPeople, 0);
            return totalReservedSeats < table.maxPeople;
        });

        res.status(200).json(tablesAvailable);

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

//Export functions
export {
    prueba,
    makeReservation,
    reservationsTomorrow

};