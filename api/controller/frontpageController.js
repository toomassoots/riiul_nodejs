const frontpageService = require('../service/frontpageService')

const frontpageController = {};
//Esilehe endpoint, tagastakse erialad ja tööd, mis käivad esilehel.
frontpageController.read=async(req,res)=>{
    //Erialad
    const subject = await frontpageService.subjects()
    //Tööd
    const works = await frontpageService.works()

    res.status(200).json({
        success:true,
        subject,
        works
    })
}
//Eriala vaate endpoint. Tagastakse tööd, mis vastavad valitud eriala alla kuuluvatele töödele
frontpageController.subjectView=async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const subjectView = await frontpageService.subjectView(id)

    res.status(200).json({
        success: true,
        subjectView
    })
}

//Üksiku töö vaade. 
frontpageController.readWork=async(req,res)=>{
    const id = req.params.id

    const tags = await frontpageService.tags(id);
    const work = await frontpageService.work(id);
    const authors = await frontpageService.authors(id);
    const files = await frontpageService.files(id);
    
    res.status(200).json({
       success:true,
       tags: tags,
       work: work,
       authors: authors,
       files: files
    })
    
}

module.exports=frontpageController;