// import Taskroutes.js from 'index.js'
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../Controllers/Taskcontroller.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Taskroutes = (app) => {
    app.route('/Task')
        .get( getTasks)
        .post( createTask);

    app.route('/Task/:id')
        .put( updateTask)
        .get( getTask)
        .delete( deleteTask);
}


export default Taskroutes;