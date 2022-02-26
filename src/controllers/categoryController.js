import connection from '../database.js'

export async function getCategories (req, res) {
    try {
        const {rows: categories} = await connection.query(
            'SELECT * FROM categories'
        )
        res.send(categories)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function newCategory(req, res) {
    try {
        const {name} = req.body
        if (name === ""){
            return res.status(400).send('Name está vazio')
        }

        const result = await connection.query(`
            SELECT id FROM categories WHERE name=$1
        `,[name])
        if (result.rows.length > 0){
            return res.status(409).send('Categoria já cadastrada')
        }

        await connection.query(`
            INSERT INTO categories (name)
            VALUES ($1)
        `, [name])

        res.sendStatus(201)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
