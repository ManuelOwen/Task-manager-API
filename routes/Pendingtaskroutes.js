// import Taskroutes.js from 'server.js'
import { getTasks, getTask,updateTask, deleteTask } from '../Controllers/PendingtasksController.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Taskroutes = (app) => {
    app.route('/pendingtask')
        .get( getTasks)
       

    app.route('/pendingtask/:id')
        .put( updateTask)
        .get( getTask)
        .delete( deleteTask);
}


export default Taskroutes;