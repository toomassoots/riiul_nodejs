const util = require("util");
const path = require("path");
const multer = require("multer");
const { v4:uuidv4} = require("uuid");
let storage= multer.diskStorage({
    // Salvestus koht vastavalt failitüübile.
    destination:(req, file, cb)=>{
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype==='image/png'){
        cb(null, './public/photos');
         }else if(file.mimetype==='application/pdf'){
        cb(null, './public/files')
        }else{
            cb(null, false);
            return cb(new Error("Failitüüp on vale!"));
        }
    },
    //Failidele antakse uus nimi, sest muidu sama nimega failid kirjutatakse üle
    //UUIDv4 teeb suvalise string-i.
    filename: (req, file, cb)=>{
        //console.log(file);
        cb(null, uuidv4()+path.extname(file.originalname));
    }
})

let uploadFile=multer({
    storage:storage,
    
}).fields([
    {
        name:'document',
        maxCount:1
    },
    {
        name:'files',
        maxCount:3
    }
]);

const fileUpload =util.promisify(uploadFile)

module.exports=fileUpload