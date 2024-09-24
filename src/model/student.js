const {pool} = require('../config/pg');


async function insertEnrollData(data){
    // console.log(data);
    const {courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,coursecompilation} = data;

    const client =await pool.connect();
    
    try {
        
        const query = `INSERT INTO progress (courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,coursecompilation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;
        const values = [courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,coursecompilation];
        const result = await client.query(query,values);
        return result.rows[0];    
    } catch (error) {
        console.log(error);
        
    }finally{
        client.release();
    }
}

async function findAllEnrolledProgressData(id){
    try {
        const q = 'SELECT * FROM progress WHERE studentid = $1;'
        const values = [id];
        const {rows} = await pool.query(q,values);
        return rows;
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={
    insertEnrollData,
    findAllEnrolledProgressData
}