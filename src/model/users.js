const {pool} = require('../config/pg');
const bcrypt = require('bcrypt');

exports.createUser = async function(userData) {
    // console.log(userData);
    
    let saltRounds = 10;
    let { username,usertype, useremail, password } = userData;

    try {
        
        if (password!=='GoogleCredential'){password = await bcrypt.hash(password, saltRounds);};
        // console.log(hashedValue)

        const q = `INSERT INTO users (username, usertype, useremail, password) VALUES ($1, $2, $3, $4)`;
        const values = [username, usertype, useremail, password];

        const { rows } = await pool.query(q, values);
        return rows[0];
    } catch (err) {
        console.error("Error:", err);
        throw err;
    }
}

exports.getUser = async()=>{
    try{
       const q = `SELECT * FROM users;`
       const {rows} = await pool.query(q)
       return rows
    }catch(err){
        throw err
    }
}

exports.findUser = async(email,type)=>{
    try{
       const q = `SELECT * FROM users where useremail = $1 AND usertype = $2`
       values =[email,type];
       const {rows} = await pool.query(q,values)
       return rows[0]
    }catch(err){
        throw err
    }
}

exports.findOne = async(email)=>{
    try{
       const q = `SELECT * FROM users where useremail = $1;`
       values =[email]
       const {rows} = await pool.query(q,values)
       return rows[0]
    }catch(err){
        throw err
    }
}

exports.updatePass = async(data)=>{
    try{
        const {hashedPassword,id} = data
        const query = `UPDATE users SET password = $1 WHERE id = $2`;
        const values = [hashedPassword, id];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return { success: false, message: "User not found" };
        }
        // console.log("Password updated successfully for user:", id);
        return { success: true, message: "Password updated successfully" };

    }catch(err){
        throw err
    }
}

exports.updateUsertype = async(usertype,useremail)=>{
    try{
        
        const query = `UPDATE users SET usertype = $1 WHERE useremail = $2`;
        const values = [usertype,useremail];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return { status: false, message: "User not found" };
        }
        // console.log("Password updated successfully for user:", id);
        return { success: true, message: "Usertype updated successfully" };

    }catch(err){
        throw err
    }
}
