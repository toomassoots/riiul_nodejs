const bcrypt =require("bcrypt");

const hashService={};
//Parooli hashimine
hashService.hash= async(password)=>{
    const pwd= await bcrypt.hashSync(password, 12);
    return pwd;
}
//Parooli võrdlemine
hashService.compare = async(password, pwd)=>{
    const match = await bcrypt.compare(password, pwd)
    return match;
}
module.exports=hashService;