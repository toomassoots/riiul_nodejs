const db=require('../../db');
 
const frontpageService={};
//Esilehe vaade
frontpageService.subjects= async()=>{
    const subject= await db.query(`SELECT DISTINCT subject.id, subject.name FROM subject inner join portfolio on subject.id =portfolio.subject_ID where portfolio.active =1`)
    return subject;
}
frontpageService.works= async()=>{
    const works= await db.query('select subject.id as subjectid, portfolio.id, portfolio.title, portfolio.active, portfolio.priority, file.file_loc_url from ((portfolio inner join subject on portfolio.subject_ID=subject.id) inner join file on portfolio.id=file.portfolio_ID) where file.type="thumbnail" and file.priority=1 and portfolio.active=1 and portfolio.priority=1')
    return works;
}
// Eriala vaade
frontpageService.subjectView= async(id)=>{
    const subjectView= await db.query('select portfolio.id, portfolio.title, file.file_loc_url from ((portfolio inner join subject on portfolio.subject_ID=subject.id) inner join file on portfolio.id=file.portfolio_ID) where file.type="thumbnail" and subject.id=? and file.priority=1 and portfolio.active=1 order by portfolio.priority',[id])
    return subjectView;
}

//Üksiku töö vaate päringud(Tekstid, sildid, autorid, failid)
frontpageService.work= async(id)=>{
    const work =await db.query('select  portfolio.title, portfolio.text, subject.name from portfolio inner join subject on portfolio.subject_ID= subject.id where portfolio.id=? and portfolio.active=1', [id]);
    return work;
}
frontpageService.tags= async(id)=>{
    const tags = await db.query('SELECT tag.id, tag.tag from tag inner join tag_portfolio on tag_portfolio.tag_ID =tag.id where tag_portfolio.portfolio_ID= ?',[id]);
    return tags;
}
frontpageService.authors= async(id)=>{
    const authors =await db.query('SELECT author.id, author.name from author inner join author_portfolio on author_portfolio.author_ID =author.id where author_portfolio.portfolio_ID= ?',[id]);
    return authors;
}
frontpageService.files= async(id)=>{
    const files= await db.query('select id, file_loc_url,type, text from file where portfolio_ID=? and type!="thumbnail"',[id]);
    return files;
}

module.exports= frontpageService;