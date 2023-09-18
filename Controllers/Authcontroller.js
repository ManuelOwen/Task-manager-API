import sql from 'mssql';
import config from '../model/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// export const loginRequired = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     return res.status(401).json({ message: 'Unauthorized user!' });
//   }
// };
// TO REGISTER USER
export const register = async (req, res) => {
  const { username, userpassword, useremail, userid } = req.body;
  const saltRounds = 10;

  // Check if required fields are provided
  if (!username)  {
    return res.status(400).json({ error: 'username required' });
  }if(!userpassword){
    return res.status(400).json({error:'userpassword required'});
  }if(!useremail){
    return res.status(400).json({error:'user email required'})
  }
//register user
  try {
    const hashedPassword = await bcrypt.hash(userpassword, saltRounds);
    const pool = await sql.connect(config.sql);

    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('useremail', sql.VarChar, useremail)
      .input('userpassword', sql.VarChar, hashedPassword)
      .query('SELECT * FROM users WHERE username = @username OR useremail = @useremail OR userpassword=@userpassword');

    const user = result.recordset[0];

    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }

    await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('userid', sql.VarChar, userid)
      .input('useremail', sql.VarChar, useremail)
      .input('userpassword', sql.VarChar, hashedPassword)
      .query('INSERT INTO users (username, userid, useremail, userpassword) VALUES (@username, @userid, @useremail, @userpassword)');

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error occurred while creating user' });
  } finally {
    await sql.close();
  }
};
//login user
export const login = async (req, res) => {
  const { username, userpassword } = req.body;

  // Check if required fields are provided
  if (!username || !userpassword) {
    return res.status(400).json({ error: 'username and userpassword are required' });
  }

  try {
    const pool = await sql.connect(config.sql);

    const result = await pool
      .request()
      .input('Username', sql.VarChar, username)
      .input('userpassword', sql.VarChar, userpassword)
      .query('SELECT * FROM users WHERE Username = @Username OR userpassword=@userpassword');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Authentication failed. Wrong name or password' });
    }

    const user = result.recordset[0];

    if (!bcrypt.compareSync(userpassword, user.userpassword)) {
      return res.status(401).json({ error: 'Authorization failed. Wrong credentials' });
    }

    const token = jwt.sign(
      { username: user.username, useremail: user.useremail, userpassword: user.userpassword },
      config.jwt_secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      useremail: user.useremail,
      username: user.username,
      userpassword: user.userpassword,
      token: token
    });
  } catch (error) {
    console.error('Error during login:', error);
    console.log('error')
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await sql.close();
  }
};

