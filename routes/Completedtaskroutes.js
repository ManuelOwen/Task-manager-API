// import Taskroutes.js from 'server.js'
import { getTasks, getTask,   deleteTask } from '../Controllers/CompletedtaskController.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Completedtasksroutes = (app) => {
    app.route('/Completedtask')
        .get( getTasks)


    app.route('/Completedtask/:id')
       
        .get( getTask)
        .delete( deleteTask);
}


export default Completedtasksroutes;