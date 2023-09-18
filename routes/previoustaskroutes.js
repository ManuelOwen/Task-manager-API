// import Taskroutes.js from 'server.js'
import { getTasks, getTask,   deleteTask } from '../Controllers/PrevioustaskController.js';
import { login, register } from '../Controllers/Authcontroller.js';


const Previoustaskroutes = (app) => {
    app.route('/previoustask')
        .get( getTasks)


    app.route('/previoustask/:id')
       
        .get( getTask)
        .delete( deleteTask);
}


export default Previoustaskroutes;