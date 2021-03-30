const pingController = {};

//GET 

pingController.ping =(req,res)=>{
    res.status(200).json({
        success:true
    })
}

module.exports=pingController;