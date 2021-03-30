const db = require('../../db');
const portfolioService={}

//Töö lisamine andmebaasi
portfolioService.work=async(portfolio)=>{
const portfolio_id = await db.query("INSERT INTO portfolio SET?",[portfolio]);
return portfolio_id.insertId;
}



//Autorite lisamine
portfolioService.authors=async(authorsArray,portfolio_id,subjectid)=>{

    console.log(authorsArray)
    console.log(portfolio_id)
   let authorID= await portfolioService.checkAuthor(authorsArray);
    //Uue autori lisamine
   if(!authorID){
  const authorResult= await db.query("INSERT INTO author (name) VALUES(?)", [authorsArray])
  
  }
  let newauthorID= await portfolioService.checkAuthor(authorsArray)

  authorID = newauthorID;
  const subject_author= await portfolioService.checkAuthorSubject(subjectid, authorID);
  console.log(subject_author);

  if(!subject_author){
      const authorSubject= await db.query("INSERT INTO subject_author (author_ID, subject_ID) VALUES(?,?)",[authorID,subjectid])
  }
  //Autori ja töö sidumine andmebaasis
  if(authorID){
   const addRow= await db.query('INSERT INTO author_portfolio (author_ID, portfolio_ID) VALUES(?,?) ',[authorID, portfolio_id])
    return addRow;
}
}

//Kontroll, kas autor on juba andmebaasis olemas 
portfolioService.checkAuthor=async(authorsArray)=>{
    console.log(authorsArray)
const authorResult= await db.query('SELECT id FROM author WHERE name = ? LIMIT 1', [authorsArray])
if (authorResult.length < 1) return false;
return authorResult[0].id   
}
//Kontroll, kas autor ja eriala seos on juba baasis olemas
portfolioService.checkAuthorSubject=async(subjectid, authorID)=>{
const subjectauthorResult= await db.query("SELECT ID FROM subject_author WHERE author_ID=? and subject_ID=?",[authorID, subjectid])
console.log( subjectauthorResult)
if (subjectauthorResult.length < 1) return false;
return subjectauthorResult[0].ID   
}
//Siltide andmebaasi lisamine
portfolioService.tags=async(tagsArray, portfolio_id)=>{

    let tagID = await portfolioService.checkTag(tagsArray);
    //Uue sildi loomine
    if(!tagID){
        const newTag = await db.query('INSERT INTO tag (tag) VALUES(?)', [tagsArray])
    }
    let newTagID = await portfolioService.checkTag(tagsArray);
    tagID= newTagID;
    //Sildi ja töö sidumine andmebaasis
   const tagPortfolio =  await db.query("INSERT INTO tag_portfolio (tag_ID, portfolio_ID) VALUES(?,?)",[tagID, portfolio_id])

}
//Kontroll, kas selline silt juba on andmebaasis olemas
portfolioService.checkTag=async(tagsArray)=>{
    console.log(tagsArray)
const tagResult= await db.query('SELECT id FROM tag WHERE tag = ? LIMIT 1', [tagsArray])
if (tagResult.length < 1) return false;
return tagResult[0].id   
}
//Piltide ja dokumendi andmebaasi lisamine
portfolioService.file=async(files)=>{
const fileUpload = await db.query("INSERT INTO file(file_loc_url, name, text,type, portfolio_ID, priority, size) VALUES(?,?,?,?,?,?,?)",[files.file_loc_url, files.name, files.text,files.type, files.portfolio_ID, files.priority, files.size ])
}
module.exports=portfolioService;