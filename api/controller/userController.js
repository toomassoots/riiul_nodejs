const { request } = require('../../app');
const userService = require('../service/userService');
const userController={};
userController.read = async (req, res) => {
    const users = await userService.read();

    res.status(200).json({
        success: true,
        users: users
    });
}
//Kasutaja loomise endpoint
userController.addUser= async(req, res)=>{
    const name = typeof(req.body.name)==='string' && req.body.name.trim().length>0?req.body.name:false;
    const email = typeof(req.body.email)==='string' && req.body.email.trim().length>0?req.body.email:false;
    const password = typeof(req.body.password)==='string' && req.body.password.trim().length>0?req.body.password:false;
    //Kontroll, et kas väljad on täidetud
    if(name&&email&&password){
    const newUser={
        name,
        email,
        password
    }
    const createUser = await userService.create(newUser);

    res.status(201).json({
        success: true,
        message: "Kasutaja loodud"
    })
    }else{
        res.status(400).json({
            success: false,
            message: "Nõutavad väljad ei ole täidetud"
        })
    }

}
//Kasutaja muutmise endpoint
userController.editUser= async(req,res)=>{
    const id = typeof(req.body.id) === 'string' ? req.body.id : false;

    if(id || id === 0) {
    const email = typeof(req.body.email) === 'string' && req.body.email.trim().length > 0 ? req.body.email : false;
    const name = typeof(req.body.name) === 'string' && req.body.name.trim().length > 0 ? req.body.name: false;
    const password = typeof(req.body.password) === 'string' && req.body.password.trim().length > 3 ? req.body.password : false;
   
    
    
    const user = {
        id,  
        name,
        email,
        password
    };
    console.log(user);
    const updatedUser =  await userService.editUser(user);
        
        res.status(200).json({
            success: true,
            user: updatedUser
        });
   
} else {
   
    res.status(400).json({
        success: false,
        message: 'Nõutavad väljad ei ole täidetud'
    });
}

}

userController.deleteUser=async(req,res)=>{
        // Check if required data exists
        const id = typeof(req.body.id) === 'number' ? req.body.id : false;

        if(id || id === 0) {
            const result= await userService.delete(id)
            res.status(200).json({
                success: result
            });
        } else {
        
            res.status(400).json({
                success: false,
                message: 'Nõutavad väljad ei ole täidetud'
            });
        }
    
}

module.exports=userController;