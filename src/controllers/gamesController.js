import connection from '../database.js'

export async function getGames (req, res) {
    try {
        const games = await connection.query(`
            SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName" FROM games
            JOIN categories ON
            games."categoryId"=categories.id 
        `)

        if (req.query.name) {
            const toFilter = req.query.name.toLowerCase()
            
            const filterGames = await connection.query(`
                SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName" FROM games
                JOIN categories ON
                games."categoryId"=categories.id 
                WHERE LOWER(games.name) like $1
            `,[toFilter+'%'])

            return res.send(filterGames.rows)
        }

        res.send(games.rows)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function postGames (req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        const realCategory = await connection.query(`
            SELECT categories.id FROM categories 
            WHERE id=$1
        `,[categoryId])
        if ((stockTotal || pricePerDay) < 0 || realCategory.rows[0] === undefined) {
            return res.sendStatus(400)
        }

         const searchSameGame = await connection.query(`
        SELECT games.name FROM games 
        WHERE games.name like $1  
         `,[name])
        if (searchSameGame.rows[0] !== undefined) {
            if (searchSameGame.rows[0].name === name) {
                return res.sendStatus(409)
            }
        }  

         const result = await connection.query(`
            INSERT INTO 
            games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
        `,[name, image, stockTotal, categoryId, pricePerDay*100]) 

        res.sendStatus(201)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}