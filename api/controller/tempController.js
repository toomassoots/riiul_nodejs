const tempService = require('../service/tempService')

const tempController = {};

tempController.pics=async(req,res)=>{
    const pics = await tempService.pics()

    res.status(200).json({
        success:true,
        pics
    })
}
tempController.editPic=async(req,res)=>{
    const id = req.body.id
    const file = req.body.file_loc_url
    const newUrl={
        id, 
        file
    }
    console.log(newUrl)
    const edited = await tempService.edit(newUrl)

    res.status(200).json({
        success: true,
        edited
    })
}


module.exports=tempController;