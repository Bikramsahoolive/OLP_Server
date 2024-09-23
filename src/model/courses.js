const firebase = require('../config/firebase');
const { getStorage, ref, uploadString, getDownloadURL, deleteObject } = require("firebase/storage");
const {pool} = require('../config/pg');

const storage = getStorage(firebase);




async function getFileUrl(data,format){
    try {
        if (format === "img"){
            if(data!=='null'){
            const Filename = `banner_${Date.now()}`;
            // const photoFile = data;
            // data.photoFileName = photoFilename;
            const storageRef2 = ref(storage, `banner/${Filename}`);
            const snapshot2 = await uploadString(storageRef2, data, 'data_url');
            const url = await getDownloadURL(snapshot2.ref);
            const urlData = {filename:Filename,url:url}
            return urlData;
            }else{
                return null;
            }
        }else if(format === "pdf"){
            if(data!=='null'){
                const Filename = `pdf_${Date.now()}`;
                // const File = data;
                // data.photoFileName = photoFilename;
                const storageRef2 = ref(storage, `pdf/${Filename}`);
                const snapshot2 = await uploadString(storageRef2, data, 'data_url');
                const url = await getDownloadURL(snapshot2.ref);
                const urlData = {filename:Filename,url:url};
                return urlData;
            }else{
                return null;
            }
        }
    } catch (error) {
        console.log(error);
        
    }
    
}

async function insertData(data){
    // console.log(data);
    let {creatorid,creatorname,category,coursename,description,videolink,bannerimage,pdf,slides} = data;

    const pdfurl =await getFileUrl(pdf,'pdf');
    const imgurl =await getFileUrl(bannerimage,'img');

    
    if(pdfurl!==null)pdf = JSON.stringify(pdfurl);
    if(imgurl!==null)bannerimage = JSON.stringify(imgurl);
    
    const client =await pool.connect();
    
    try {
        
        const query = `INSERT INTO courses (creatorid,creatorname,category,coursename,description,videolink,bannerimage,pdf,slides) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;
        const values = [creatorid,creatorname,category,coursename,description,videolink,bannerimage,pdf,slides];
        const result = await client.query(query,values);
        return result.rows[0];    
    } catch (error) {
        console.log(error);
        
    }finally{
        client.release();
    }
}

async function insertExamData(data){

    const{courseid,creatorid,quiz,assignment} = data;
    const client =await pool.connect();
    try {
        
        const query = `INSERT INTO exams (courseid,creatorid,quiz,assignment) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const values = [courseid,creatorid,quiz,assignment];
        const result = await client.query(query,values);
        return result.rows[0];    
    } catch (error) {
        console.log(error);
        
    }finally{
        client.release();
    }
}

async function fetchQuizOfCourseId(id){

    try {
        const q = 'SELECT quiz FROM exams WHERE courseid = $1;'
        const values = [id];
        const result = await pool.query(q,values);
        return result.rows[0];
        
    } catch (error) {
        console.log(error);
        
    }
}

async function fetchAssignmentOfCourseId(id){
    
    try {
        const q = 'SELECT assignment FROM exams WHERE courseid = $1;'
        const values = [id];
        const result = await pool.query(q,values);
        return result.rows[0];
        
    } catch (error) {
        console.log(error);
        
    }
}

async function fetchAllCourse(){

    try {
        const result = await pool.query('SELECT * FROM courses');
        return result.rows;
        
    } catch (error) {
        console.log(error);
        
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

module.exports= {insertData,fetchAllCourse,fetchCreatorsCourse,insertExamData,fetchQuizOfCourseId,fetchAssignmentOfCourseId};