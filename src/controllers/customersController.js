import connection from '../database.js'

export async function getCustomers (req, res) {
    try {
        if (req.query.cpf) {
            const filterCustomers = await connection.query(
            'SELECT * FROM customers WHERE customers.cpf like $1',[customers.cpf+'%'])
           
            res.send(filterCustomers.rows)
        }

        const customers = await connection.query(
            'SELECT * FROM customers')
        
            res.send(customers.rows)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function getCustomer (req, res) {
    const { id } = req.params;

    try {
        const result = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (result.rowCount === 0) {
        return res.sendStatus(404);
        }

    res.send(result.rows[0]);
        
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function createCustomer (req, res) {
    const { name, phone, cpf, birthday } = req.body
    
    try {
        const searchSameCustomer = await connection.query(`
        SELECT customers.cpf FROM customers 
        WHERE customers.cpf like $1  
         `,[cpf])

        if (searchSameCustomer.rows[0] !== undefined) {
            if (searchSameCustomer.rows[0].cpf === cpf) {
                return res.sendStatus(409)
            }
        }  

        const result = await connection.query(`
            INSERT INTO 
            customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `,[name, phone, cpf, birthday]) 

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function putCustomer (req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body

    try {
        const searchSameCustomer = await connection.query(`
        SELECT customers.cpf FROM customers 
        WHERE customers.cpf like $1  
         `,[cpf])

        if (searchSameCustomer.rows[0] !== undefined) {
            if (searchSameCustomer.rows[0].cpf === cpf) {
                return res.sendStatus(409)
            }
        } 

        await connection.query(`
           UPDATE customers SET
           name=$1, phone=$2, cpf=$3, birthday=$4
           WHERE id=$5
        `,[name, phone, cpf, birthday, id])

        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}