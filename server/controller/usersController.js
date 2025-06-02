// controllers/usersController.js
const pool = require('../db');

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  const { firstname, lastname, age, gender, interests, description } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (firstname, lastname, age, gender, interests, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstname, lastname, age, gender, interests, description]
    );
    res.json({ message: 'User created', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Insert failed' });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, age, gender, interests, description } = req.body;

  try {
    // ดึงข้อมูลผู้ใช้เดิม
    const existingUserResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingUser = existingUserResult.rows[0];

    // ใช้ค่าที่ส่งมา ถ้าไม่ส่งให้ใช้ค่าปัจจุบัน
    const updatedFirstname = firstname !== undefined ? firstname : existingUser.firstname;
    const updatedLastname = lastname !== undefined ? lastname : existingUser.lastname;
    const updatedAge = age !== undefined ? age : existingUser.age;
    const updatedGender = gender !== undefined ? gender : existingUser.gender;
    const updatedInterests = interests !== undefined ? interests : existingUser.interests;
    const updatedDescription = description !== undefined ? description : existingUser.description;

    // อัปเดตข้อมูล
    const { rows } = await pool.query(
      `UPDATE users 
       SET firstname = $1, lastname = $2, age = $3, gender = $4, interests = $5, description = $6 
       WHERE id = $7 
       RETURNING *`,
      [updatedFirstname, updatedLastname, updatedAge, updatedGender, updatedInterests, updatedDescription, id]
    );

    res.json({ message: 'User updated', data: rows[0] });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
