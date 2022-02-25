import connection from '../database.js'

export async function getCategories (req, res) {
    try {
        const categories = await connection.query(
            'SELECT * FROM categories'
        )
        res.send(categories.rows)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
