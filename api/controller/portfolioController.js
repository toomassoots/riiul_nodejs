const { request } = require('express');
const portfolioService =require ("../service/portfolioService");
const uploadFile =require ("../middleware/fileUpload");
const path =require ("path");
const sharp= require("sharp");
const config = require('../../config');
const {
    v4:uuidv4
} = require("uuid");
const portfolioController={};

portfolioController.addPortfolio= async(req, res) =>{
    //Andmete ja failide üleslaadimine 
    await uploadFile(req, res)
    //Andmete kontroll
    const title = typeof(req.body.title)=== 'string'&& req.body.title.trim().length>0?req.body.title:false;
    const text = typeof(req.body.description)=== 'string'&& req.body.description.trim().length>0?req.body.description:false;
    const authors = typeof(req.body.authors)=== 'string'&& req.body.authors.trim().length>0?req.body.authors:false;
    const tags = typeof(req.body.tags)=== 'string'&& req.body.tags.trim().length>0?req.body.tags:false;

    const phototext1 = typeof(req.body.phototext1)=== 'string'?req.body.phototext1:false;
    const phototext2 = typeof(req.body.phototext2)=== 'string'?req.body.phototext2:false;
    const phototext3 = typeof(req.body.phototext3)=== 'string'?req.body.phototext3:false;
    const fileText = typeof(req.body.fileText)=== 'string'?req.body.fileText:false;
    const priority = typeof(Number(req.body.priority))==='number'? Number(req.body.priority ): false;
    const active = typeof(Number(req.body.active))==='number'? Number(req.body.active) : false;
    const subject_ID = typeof(Number(req.body.subject_ID))==='number'?Number(req.body.subject_ID):false;
    
    //Autorite ja siltide(tag) stringidest tehakse array-d 
    let authorsArray= authors.split(',').map(function(item){
        return item.trimLeft()
    })
   let tagsArray= tags.split(',').map(function(item){
        return item.trimLeft()
    })
    //Sisse logitud kasutaja id, mis saadakse jsonwebtokenist kätte. 
   const author_ID = req.user
   //const author_ID = 1;
  
   // Piltide tekstid pannakse arraysse
   let texts =[]
   texts.push(phototext1)
   texts.push(phototext2)
   texts.push(phototext3)
   console.log(texts)
//Kui vajalikud andmed on olemas siis minnakse edasi
//Kui ei ole siis on tagastatakse status kood 400 ja tekst
 if(title&&text&&authorsArray&&tagsArray&&subject_ID){
        
       
        //Luuakse json ja see saadedakse andmebaasi päringusse 
        const portfolio={
            title,
            text,
 	    priority,
            author_ID,
            active, 
            subject_ID,
	    style_ID:1
           
        }
        
      const portfolio_id = await portfolioService.work(portfolio)
     // console.log(portfolio_id);
    //Autorite ja siltide lisamine
     for(i=0; i<authorsArray.length; i++){
       await portfolioService.authors(authorsArray[i], portfolio_id,subject_ID);
      }
      
      for(i=0; i<tagsArray.length; i++){
          await portfolioService.tags(tagsArray[i], portfolio_id);
      }
      // PDF dokumendi lisamine
      // PDF-i lisamine ei ole kohustuslik siis if-ga toimub kontroll, kas on üldse midagi lisatud
     // Size vajab muutmist
      if(req.files.document){
        const document={     
            file_loc_url: 'http://localhost:9100/API/public/files/'+req.files.document[0].filename,
            name: req.files.document[0].filename,
            type: req.files.document[0].mimetype,
            text: fileText,
            portfolio_ID: portfolio_id,
            priority:0,
            size:100
            
        }
        const documentQuery = await portfolioService.file(document);
        }

        //Piltide lisamine.
        // 1 pilt peab vähemalt olema.
        //Kui pilti ei ole saadetakse error  
        if(req.files.files){
        const name = uuidv4()+path.extname(req.files.files[0].path)
        //Path, kuhu Sharp uued failid loob.
        
        const targetPortfolioThumbnail = '/var/www/html/API/public/portfolioThumbnails/'
        const targetThumbnail ='/var/www/html/API/public/thumbnails/'+name
        //1 on esilehele(200*200px) ja 1-3 on üksiku töö vaatesse(400*400px)
        //Esilehele loodav fail on alati esimene array-s 
        //Rotate võtab automaatselt EXIF andemed ja teeb ise õigeks pööramise. Ilma selleta tulevad osad pildid tagurpidi
       const thumbnailsize = sharp(req.files.files[0].path).rotate().resize( 200,200).toFile(targetThumbnail).then((data)=>{ data.size}).catch((err)=>console.log(err))
      
        const thumbnail= {
            file_loc_url: 'http://localhost:9100/API/public/thumbnails/'+name,
            name: name,
           text:phototext1,
            type:"thumbnail",
           portfolio_ID: portfolio_id,
            priority:1,
            size:100    
        }

       const thumbnailQuery= await portfolioService.file(thumbnail);
        for(i=0; i<req.files.files.length; i++){
            const photos = {
                file_loc_url: 'http://localhost:9100/public/photos/'+req.files.files[i].filename,
                name: req.files.files[i].filename,
                text: texts[i],
                type: req.files.files[i].mimetype,
                portfolio_ID: portfolio_id,
                priority:0,
                size:100
                
            }
          const photoQuery = await portfolioService.file(photos);
         
            portfolioThumbnailName = uuidv4()+path.extname(req.files.files[i].path)
            const portfolioThumbnail= {
                file_loc_url: 'http://localhost:9100/API/public/portfolioThumbnails/'+portfolioThumbnailName,
                name: portfolioThumbnailName,
                text: texts[i],
                type:"portfolioThumbnail",
                portfolio_ID: portfolio_id,
                priority:0,
                size:2
            }
           const pThumbnailsQuery = await portfolioService.file(portfolioThumbnail, portfolio_id);
            sharp(req.files.files[i].path).rotate().resize( 400,400).toFile(targetPortfolioThumbnail+uuidv4()+path.extname(req.files.files[i].path)).catch((err)=>console.log(err)) 
        
        }
    }else{
        res.status(400).json({
            message:"Tööl peab olema vähemalt 1 pilt"
        })
    }

   
    res.status(201).json({
        success:true,
        message:"Töö laeti edukalt üles"
    });

    }else{
        res.status(400).json({
            message:"Kõik väljad ei ole täidetud "
        })
    }
}



module.exports=portfolioController;