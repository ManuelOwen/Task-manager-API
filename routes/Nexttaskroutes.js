// import Taskroutes.js from 'server.js'
import { getTasks, getTask,  updateTask, deleteTask } from '../Controllers/NexttaskController.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Taskroutes = (app) => {
    app.route('/Nexttasks')
        .get( getTasks)
        

    app.route('/Nexttask/:id')
        .put( updateTask)
        .get( getTask)
        .delete( deleteTask);
}


export default Taskroutes;