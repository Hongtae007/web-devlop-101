const express = require('express')
const bodyParser = require('body-parser')
// const dotenv = require('dotenv');
// const { Pool } = require('pg');
// const pool = new Pool();

const pool = require('./db');

const app = express()

dotenv.config();
// Sample bodyParser 
app.use(bodyParser.json())

// Sample book data
const books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
  { id: 3, title: 'Book 3', author: 'Author 3' },
]

// testget pg
app.get('/testpg', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'connected', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/userspg', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all books
app.get('/api/books', (req, res) => {
  res.json(books)
})

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
 */

// สำหรับเก็บ users
// let users = []
// let counter = 1
// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async(req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows)
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async(req, res) => {
  let user = req.body
  const result = await pool.query('INSERT INTO users SET ?', user);

  console.log('result', result)

  res.json({
    massage: 'insert ok',
    data: result[0]
  })
})

// path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/user/:id', (req, res) => {
  const id = req.params.id
  // หา user รายคนออกมาโดยใช้ id
  const selectedIndex = users.findIndex(user => user.id == id)
  if (!selectedIndex) {
  return res.status(404).json({ message: 'User not found' })
}
  res.json(users[selectedIndex])
  
})

// path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/user/:id', (req, res) => {
  const id = req.params.id
  const updateUser = req.body

  //หา user จาก id
  const selectedIndex = users.findIndex(user => user.id == id)

  //update users นั้น
  // if (updateUser.firstname){
  //   users[selectedIndex].firstname = updateUser.firstname
  // }
  // if (updateUser.lastname){
  //   users[selectedIndex].lastname = updateUser.lastname
  // }
  users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
  users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
  users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender

  res.json({
    message: 'update user complete !',
    data: {
      user : updateUser,
      indexUpdate: selectedIndex
    }
  })

  res.send(selectedIndex + '')
})

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  // หาว่า index ไหนที่จะลบ
  const selectedIndex = users.findIndex(user => user.id == id)

  //ลบ
  users.splice(selectedIndex, 1)

  res.json({
    message: 'delete user complete !',
    indexDeleted: selectedIndex
  })
})


const port = 8000;
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`)
})

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());

// ✅ POST /users
app.post('/users', async (req, res) => {
  const { firstname, lastname, age, gender, interests, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, age, gender, interests, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstname, lastname, age, gender, interests, description]
    );
    res.json({ message: 'Insert ok', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// ✅ GET all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ GET user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ PUT update user
app.put('/users/:id', async (req, res) => {
  const { firstname, lastname, age, gender, interests, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET firstname = $1, lastname = $2, age = $3, gender = $4, interests = $5, description = $6
       WHERE id = $7 RETURNING *`,
      [firstname, lastname, age, gender, interests, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ DELETE user
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Test connection
app.get('/testpg', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'connected', time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Mock books API (ถ้าอยากเก็บไว้ก็ได้)
const books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
];
app.get('/api/books', (req, res) => res.json(books));

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
-----------------------------------------------------------------------------------

