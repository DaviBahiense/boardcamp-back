import connection from '../database.js'

export async function getGames (req, res) {
    try {
        const games = await connection.query(
            'SELECT * FROM games'
        )
        res.send(games.rows)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
