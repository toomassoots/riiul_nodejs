
const db=require('../../db');

tempService={};

tempService.pics= async()=>{
    const pics= await db.query(`SELECT id, file_loc_url from file`)
    return pics;
}
tempService.edit= async(newUrl)=>{
    const edited= await db.query('update file set file_loc_url= ?  where id=?',[newUrl.file, newUrl.id] )
    return edited;
}


module.exports= tempService;