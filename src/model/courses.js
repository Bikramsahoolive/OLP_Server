const {pool} = require('../config/pg');

async function insertData(data){
    const {creatorId,creatorName,courseType,courseName,description,contentUrl}=data;
    const client =await pool.connect();
    try {
        const query = `INSERT INTO courses (creatorid, creatorname, coursetype, coursename, description, contenturl) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const values = [creatorId,creatorName,courseType,courseName,description,contentUrl];
        const result = await client.query(query,values);
        console.log(result.rows[0]);

        
    } catch (error) {
        console.log(error);
        
    }finally{
        client.release();
    }
}

async function fetchAllCourse(){

    try {
        const result = await pool.query('SELECT * FROM courses');
        return result.rows;
        
    } catch (error) {
        
    }
}

async function fetchCreatorsCourse (id){
    try {
        
        const q = `SELECT * FROM users where id = $1;`
       values =[id]
       const {rows} = await pool.query(q,values);
       return rows;
    } catch (error) {
        
    }
}

module.exports= {insertData,fetchAllCourse,fetchCreatorsCourse};