const express = require('express');
const app = express();
const port = 3000;

const pool = require('./db');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const axios = require('axios');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Week 5 Assignment',
      version: '1.0.0',
      description: 'Assignment 8 documentation'
    },
    host: '157.245.240.94:3000',
    basePath: '/'
  },
  apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(require('sanitize').middleware);
app.use(bodyParser.json({type: 'application/json'}));

app.get('/say', async (req, res) => {

  const keywordIn = req.query.keyword;
  console.log(keywordIn);
  const render = await axios.get(('https://itis6177week6.azurewebsites.net/api/myFunction?keyword=' + keywordIn.toString())).then(response => res.send(response.data));
});

/**
 * @swagger
 * definitions:
 *   Company:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       city:
 *         type: string
 *   Foods:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       unit:
 *         type: string
 *       company_id:
 *         type: string
 */

 /**
  * @swagger
  * /agents:
  *   get:
  *     tags:
  *       - Agents
  *     description: Returns all the agents
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successfully retreived
  */
app.get('/agents', async (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();

		var query = "SELECT * from agents";
		var rows = await conn.query(query);
		res.setHeader('Content-Type', 'application/json');
		res.json(rows);
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.release();
	}
});

/**
 * @swagger
 * /student:
 *   get:
 *     tags:
 *       - Students
 *     description: Returns all the students
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retreived
 */
app.get('/student', async (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();

		var query = "SELECT * from student";
		var rows = await conn.query(query);

    res.header("Access-Control-Allow-Origin", "localhost:3000");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
		res.setHeader('Content-Type', 'application/json');
		res.json(rows);
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.release();
	}
});

/**
 * @swagger
 * /company:
 *   get:
 *     tags:
 *       - Company
 *     description: Returns all the companies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Object agents containing all the details of the customers
 */
app.get('/company', async (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();

		var query = "SELECT * from company";
		var rows = await conn.query(query);

		res.setHeader('Content-Type', 'application/json');
		res.json(rows);
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.release();
	}
});

/**
 * @swagger
 * /foods:
 *   get:
 *     tags:
 *       - Foods
 *     description: Returns all the foods
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retreived
 */
app.get('/foods', async (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();

		var query = "SELECT * from foods";
		var rows = await conn.query(query);

		res.setHeader('Content-Type', 'application/json');
		res.json(rows);
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.release();
	}
});

/**
 * @swagger
 * /company/{company_id}:
 *   put:
 *     tags:
 *       - Company
 *     description: Updates a company details
 *     produces: application/json
 *     parameters:
 *       - name: company
 *         in: body
 *         description: Fields for the Company resource
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Successfully completed
 */
app.put('/company/:company_id', async (req, res) => {
  const company_id = req.body.id;
  const company_name = req.body.name;
  const company_city = req.body.city;

  console.log(company_id);
  console.log(req.body);

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to DB');

    var rows = await conn.query(`update company set COMPANY_NAME=?, COMPANY_CITY=? where COMPANY_ID=?`, [company_name, company_city, company_id]);

    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

/**
 * @swagger
 * /foods/{item_id}:
 *   patch:
 *     tags:
 *       - Foods
 *     description: Updates a food details
 *     produces: application/json
 *     parameters:
 *       - name: item_id
 *         description: Company's ID
 *         in: path
 *         required: true
 *         type: string
 *       - name: foods
 *         in: body
 *         description: Fields for the Foods resource
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Foods'
 *     responses:
 *       200:
 *         description: Successfully completed
 */
app.patch('/foods/:item_id', async (req, res) => {
  const oldItem_Id = req.params.item_id;
  const oldID_String = oldItem_Id.toString();
  const item_id = req.body.id;
  const item_name = req.body.name;
  const item_unit = req.body.unit;
  const company_id = req.body.company_id;

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to DB');

    var rows = await conn.query(`update foods set ITEM_ID=?, ITEM_NAME=?, ITEM_UNIT=?, COMPANY_ID=? where ITEM_ID=?`, [item_id, item_name, item_unit, company_id, oldID_String]);

    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});


/**
 * @swagger
 * /company:
 *   post:
 *     tags:
 *       - Company
 *     description: Creates a new company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company
 *         description: company Object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/company', async (req, res) => {
  const company_id = req.body.id;
  const company_name = req.body.name;
  const company_city = req.body.city;

  let conn;

  try {
    conn = await pool.getConnection();
    var rows = await conn.query(`insert into company values(?, ?, ?)`, [company_id, company_name, company_city]);

    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();;
  }
});

/**
 * @swagger
 * /company/{company_id}:
 *   delete:
 *     tags:
 *       - Company
 *     description: deletes single company from DB
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company_id
 *         description: Company's ID
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete('/company/:company_id', async (req, res) => {
  var company_id = req.params.company_id;
  //console.log(body);
  console.log(req.params.company_id);
  let conn;

  try {
    conn = await pool.getConnection();
    var rows = await conn.query(`delete from company where COMPANY_ID=?`, [company_id]);

    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
