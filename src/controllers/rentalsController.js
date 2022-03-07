import connection from '../database.js'
import dayjs from 'dayjs'

export async function getRentals (req, res) {
    
    try {
        const rentalsRow = await connection.query({
            text:`
            SELECT 
                rentals.*, 
                customers.name,
                games.name, games."categoryId", categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId"=customers.id
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id=games."categoryId"
        `,
        rowMode: 'array'
        })    
        console.log(rentalsRow.rows)
        const rentals = rentalsRow.rows.map(row => {
            const [id, customerId, gameId, rentDate, daysRented,  
                returnDate, originalPrice, delayFee, 
                customerName,
                gameName, categoryId, 
                categoryName] = row

                 return {
                    id, customerId, gameId, rentDate, daysRented, 
                    returnDate, originalPrice, delayFee,
                    customer: {
                        id: customerId,
                        name: customerName
                    },
                    game: {
                        id: gameId,
                        name: gameName,
                        categoryId: categoryId,
                        categoryName: categoryName
                    }
                 }
        })
        
        if (req.query.gameId) { 
            console.log("game")
         return res.send(rentals.filter(item =>req.query.gameId.includes(item.gameId)))
        }
        if (req.query.customerId) { 
            return res.send(rentals.filter(item =>req.query.customerId.includes(item.customerId)))
        }

        res.send(rentals)

    } catch (error) {
        console.error(error); 
        res.sendStatus(500);  
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body

    const strDate = new Date().toISOString()
    const date = strDate.slice(0,10)

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE customers.id = $1',[customerId])
        const game = await connection.query('SELECT * FROM games WHERE games.id = $1',[gameId])
        
        if (customer.rows[0] && game.rows[0]) {
            const rowPrice = await connection.query('SELECT games."pricePerDay" FROM games WHERE games.id = $1',[gameId])
            const price = rowPrice.rows[0].pricePerDay

            const stock = await connection.query(`
            SELECT games."stockTotal"
            FROM games
            WHERE games.id = $1
            `,[gameId]) 
            const qtdStock = stock.rows[0].stockTotal

            const rentals = await connection.query(`
            SELECT *
            FROM rentals
            WHERE rentals."gameId" = $1
            `,[gameId]) 
            const qtdRentals = rentals.rows.length
        
            if ((qtdStock - (qtdRentals + parseInt(daysRented))) < 0 || daysRented < 1) {    
                return res.sendStatus(400)
             }

            const novo = await connection.query(`
            INSERT INTO
                rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            `, [customerId, gameId, date, daysRented, null, price * daysRented, null]) 
            
           return res.sendStatus(201) 
        }
        res.sendStatus(400)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } 
}

export async function finaliseRental(req, res) {
    const { id } = req.params

    try {
        const idExist = await connection.query('SELECT * FROM rentals WHERE rentals.id=$1',[id])
        const finalise = await connection.query('SELECT rentals."returnDate" FROM rentals WHERE rentals.id=$1',[id])

        if (!idExist.rows[0] || !finalise.rows[0]) {
            return res.sendStatus(400)
        }
        if (finalise.rows[0]) {
            if (finalise.rows[0].returnDate !== null) {
                return res.sendStatus(400)
            }
        }

        const info = await connection.query(`
        SELECT rentals."rentDate", rentals."daysRented", rentals."originalPrice" 
        FROM rentals 
        WHERE rentals.id=$1`
        ,[id])
        const originalPrice = info.rows[0].originalPrice
        const rentDate = dayjs(info.rows[0].rentDate.toISOString().slice(0,10)).format('YYYY/MM/DD')
        const daysRented = info.rows[0].daysRented
        const difDays = dayjs().diff(dayjs(rentDate), 'day')
        let tax = null
        
        if (difDays > daysRented) {
            tax = (difDays - daysRented) * (originalPrice / daysRented)
        }

        await connection.query(`
            UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2
            WHERE rentals.id=$3
        `,[dayjs().format('YYYY/MM/DD'), tax, id]) 

        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

}


