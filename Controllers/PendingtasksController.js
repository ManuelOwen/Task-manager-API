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

// // Get all Tasks
export const getTasks = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * from pendingtask");
        !result.recordset[0] ? res.status(404).json({ message: 'Tasks not found' }) :
        // console.log(Tasks)
            res.status(200).json(result.recordset);
    } catch (error)
   
    {
       console.log(error)
        res.status(201).json({ error: 'an error occurred while retrieving Tasks' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};

// // Get a single Task
export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
      
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("Task_id", sql.Int, id)
            .query("SELECT * FROM pendingtask WHERE Task_id = @Task_id");
        !result.recordset[0] ? res.status(404).json({ message: 'Task not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log (error)
        res.status(500).json({ error: 'An error occurred while retrieving Task' });
    } finally {
        sql.close();
    }
};

// // Create a new Task
// Create a new Task
// export const createTask = async (req, res) => {
//     try {
//       const { task_title, task_id, task_priority, task_description, task_category } = req.body;
//       let pool = await sql.connect(config.sql);
//       const result = await pool
//         .request()
//         .input("task_title", sql.VarChar, task_title)
//         .input("task_id", sql.VarChar, task_id)
//         .input("task_priority", sql.VarChar, task_priority)
//         .input("task_description", sql.VarChar, task_description)
//         .input("task_category", sql.VarChar, task_category)
//         .query(
//           'SELECT * FROM Tasks WHERE task_title = @task_title OR task_id = @task_id OR task_priority=@task_priority OR task_description=@task_description OR task_category=@task_category '
//         );
//         const Tasks = result.recordset[0];

//         if (Tasks) {
//           return res.status(409).json({ error: 'Tasks already exists' });
//         }
  
//       res.status(201).json({ message: "Task created successfully" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "An error occurred while creating Task" });
//     } finally {
//       sql.close(); // Close the SQL connection
//     }
//   };
  
// // Update a Task
export const updateTask = async (req, res) => {
      try {
            const { task_title, task_id, task_priority, task_description, task_category } = req.body;
            let pool = await sql.connect(config.sql);
            const result = await pool
              .request()
              .input("task_title", sql.VarChar, task_title)
              .input("task_id", sql.VarChar, task_id)
              .input("task_priority", sql.VarChar, task_priority)
              .input("task_description", sql.VarChar, task_description)
              .input("task_category", sql.VarChar, task_category)
              'SELECT * FROM Nexttask WHERE task_title = @task_title OR task_id = @task_id OR task_priority=@task_priority OR task_description=@task_description OR task_category=@task_category '
    
            res.status(200).json({ message: 'Task updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating Task' });
        } finally {
            sql.close();
        }
    };

// // Delete a Task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM Tasks WHERE task_id = ${id}`;
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the Task' });
    } finally {
        sql.close();
    }
};