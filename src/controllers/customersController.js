import connection from '../database.js'

export async function getCustomers (req, res) {
    try {
        const customers = await connection.query(
            'SELECT * FROM customers'
        )
        res.send(customers.rows)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
