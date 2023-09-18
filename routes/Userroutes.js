// import Customersroutes.js from 'server.js'
import { getusers, getuser,  updateuser, deleteuser } from '../Controllers/UserController.js';
import { login, register } from '../Controllers/Authcontroller.js';

// get users
const Userroutes = (app) => {
    app.route('/users')
        .get( getusers)
        // .post( registeruser);
//get user by id
    app.route('/user/:id')
        .put( updateuser)
        .get( getuser)
        .delete( deleteuser);
}


export default Userroutes;