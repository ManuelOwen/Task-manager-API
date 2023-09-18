import sql from 'mssql';
import config from '../model/config.js';
//login first
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

// // Get all  previous Tasks
export const getTasks = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * from previoustasks");

        !result.recordset[0] ? res.status(404).json({ message: 'Tasks not found' }) :
        // console.log(Tasks)
            res.status(200).json(result.recordset);
    } catch (error)
   
    {
       
        res.status(201).json({ error: 'an error occurred while retrieving Tasks' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};

// // Get a single previous Task
export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
      
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("Task_id", sql.Int, id)
            .query("SELECT * FROM previoustasks WHERE Task_id = @Task_id");

        !result.recordset[0] ? res.status(404).json({ message: 'Task not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log (error)
        res.status(500).json({ error: 'An error occurred while retrieving Task' });
    } finally {
        sql.close();
    }
};


// // Delete a previous  Task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM previoustasks WHERE id = ${id}`;
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the Task' });
    } finally {
        sql.close();
    }
};