const authService = require("../service/authService");

const authController={}
//Kasutaja sisse logimine
authController.login = async  (req, res) => {
    const email = typeof(req.body.email) === 'string' && req.body.email.trim().length > 0 ? req.body.email : false;
    const password = typeof(req.body.password) === 'string' && req.body.password.trim().length > 2 ? req.body.password : false;
    //Kasutajanime ja parooli olemas olu kontroll
    if(email && password){
        //Sisse logimine, kust tagastakse jsonwebtoken
        const token = await authService.login(email, password);
        if(token){
            res.status(200).json({
                success: true,
                token: token
            });
        }else{
            res.status(401).json({
                success: false,
                message: "Kasutajatunnus või parool on vale!"
            });
        }
    }else{

        res.status(400).json({
            success: false,
            message: 'Kõik väljad ei ole täidetud!'
        });
    }

}
module.exports=authController;
