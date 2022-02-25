import connection from '../database.js'

export async function getRentals (req, res) {
    try {
    /*     const rentals = await connection.query(
            'SELECT * FROM rentals'
        )
        res.send(rentals.rows[0]) */

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}