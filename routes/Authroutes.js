import { register, login } from '../Controllers/Authcontroller.js';
// REGISTER NEW USER 
const Authroutes = (app) => {
  app.route('/Auth/register')
    .post(register);
    

  app.route('/Auth/login')
    .post(login); // Add the login controller method to handle the login route

  // Don't forget to return app
  return app;
};

export default Authroutes;
