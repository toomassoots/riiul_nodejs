
const hashService = require("./hashService");
const userService = require("./userService");
const jwt = require('jsonwebtoken');
const config = require('../../config');
const authService ={}
// Sisse logimine  
authService.login= async (username, password) =>{
    //Emaili alusel kasutaja andmete saamine
    const user = await userService.readByEmail(username);
    if(user){
       //Parooli võrdlemine 
        const match = await hashService.compare(password, user.password)
        if(match){
            
            //jsonwebtokeni loomine, 
            //jwtSecret võtakse config failist. 
            const token = jwt.sign({id: user.id},config.jwtSecret, {expiresIn: 60*60*24}) 
            return token;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

module.exports=authService;