// import Taskroutes.js from 'server.js'
import { getTasks, getTask,  updateTask, deleteTask } from '../Controllers/CurrenttaskController.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Currenttaskroutes = (app) => {
    app.route('/currenttasks')
        .get( getTasks)
       

    app.route('/currenttasks/:id')
        .put( updateTask)
        .get( getTask)
        .delete( deleteTask);
}


export default Currenttaskroutes;