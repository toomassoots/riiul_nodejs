  
const hashService = require('./hashService');
const db = require('../../db');

userService = {};

//Kõikide kasutajate lugemine
userService.read = async () => {
  const users = await db.query(`SELECT id, name, email FROM user`);
  return users;
}

//Kasutaja lugemine emaili alusel
userService.readByEmail = async (email) => {
  if (!email) return false;
  const users = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
  if (users.length < 1) return false;
  return users[0];
}

//Kasutajate päring id alusel
userService.readById = async (id) => {
  if (!id) return false;
  const users = await db.query(`SELECT id, name, email FROM user WHERE id = ?`, [id]);
  if (users.length < 1) return false;
  return users[0];
}

//Kasutaja loomine
userService.create = async (user) => {
  user.password = await hashService.hash(user.password);
  const result = await db.query(`INSERT INTO user SET ?`, [user]);
  if (result.affectedRows === 0) return false; 
  return result.insertId;
}
//Kasutaja muutmine 
userService.editUser = async (user) => {
  const userToUpdate = await userService.readById(user.id);
  
    if (user.name) {
        userToUpdate.name = user.name;
    }
    if (user.email) {
        userToUpdate.email = user.email;
    }
    if (user.password) {
        userToUpdate.password =  await hashService.hash(user.password);
    }
    
    const result = await db.query(`UPDATE user SET ? WHERE id = ?`, [userToUpdate, user.id]);
    if (result.affectedRows === 0) return false;
    return true;
}
//Kasutaja kustutamine
userService.delete = async (id) => {

  console.log(id)
  const result = await db.query(`DELETE FROM user WHERE id = ?`, [id]);
  if (result.affectedRows === 0) return false
  return true;
}
module.exports=userService;