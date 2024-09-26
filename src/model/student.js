const {pool} = require('../config/pg');


async function insertEnrollData(data){
    // console.log(data);
    const {courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,creatorid} = data;

    const client =await pool.connect();
    
    try {
        
        const query = `INSERT INTO progress (courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,creatorid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;
        const values = [courseid,studentid,enrollmentstatus,learningstatus,quizstatus,quizresult,assignmentstatus,assignmentresult,creatorid];
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
async function fetchProgressData (courseId,studentId){
    try {
        
        const q = `SELECT * FROM progress WHERE courseid = $1 AND studentid = $2;`
        const value = [courseId,studentId];
        const {rows} = await pool.query(q,value);
        return rows[0];

    } catch (error) {
        console.log(error);
        
    }
}

fetchProgressData(11,1);

async function updateLearningData(studentId,courseId){
    try {
        const q = `UPDATE progress SET learningstatus=$1 WHERE courseid = $2 AND studentid = $3;`;
        const status = true;
        const value = [status,courseId,studentId];
        const result = await pool.query(q,value);
        return result.rowCount;

    } catch (error) {
        console.log(error);
        
    }
}

async function updateQuizData(studentId,courseId,qresult){
    try {
        
        const q = `UPDATE progress SET quizstatus = $1 , quizresult = $2 WHERE courseid = $3 AND studentid = $4;`;
        const status = true;
        const value = [status,qresult,courseId,studentId];
        const result = await pool.query(q,value);
        return result.rowCount;

    } catch (error) {
        console.log(error);
        
    }
}

async function updateAssignmentData(studentId,courseId){
    try {
        
        const q = `UPDATE progress SET assignmentstatus = $1  WHERE courseid = $2 AND studentid = $3;`;
        const status = true;
        const value = [status,courseId,studentId];
        const result = await pool.query(q,value);
        return result.rowCount;

    } catch (error) {
        console.log(error);
        
    }
}

async function deleteProgressData(courseId,studentId){

    try {
        
        const q = `DELETE FROM progress WHERE courseid=$1 AND studentid=$2;`;
        const value = [courseId,studentId];
        const result = await pool.query(q,value);
        return result.rowCount;

    } catch (error) {
        console.log(error);
        
    }

}


module.exports={
    insertEnrollData,
    findAllEnrolledProgressData,
    fetchProgressData,
    updateLearningData,
    updateQuizData,
    updateAssignmentData,
    deleteProgressData
}