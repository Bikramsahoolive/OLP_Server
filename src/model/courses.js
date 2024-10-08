const firebase = require('../config/firebase');
const { getStorage, ref, uploadString, getDownloadURL } = require("firebase/storage");
const { pool } = require('../config/pg');

const storage = getStorage(firebase);

async function getFileUrl(data, format) {
    try {
        if (format === "img") {
            if (data !== 'null') {
                const Filename = `banner_${Date.now()}`;
                const storageRef2 = ref(storage, `banner/${Filename}`);
                const snapshot2 = await uploadString(storageRef2, data, 'data_url');
                const url = await getDownloadURL(snapshot2.ref);
                const urlData = { filename: Filename, url: url }
                return urlData;
            } else {
                return null;
            }
        } else if (format === "pdf") {
            if (data !== 'null') {
                const Filename = `pdf_${Date.now()}`;
                const storageRef2 = ref(storage, `pdf/${Filename}`);
                const snapshot2 = await uploadString(storageRef2, data, 'data_url');
                const url = await getDownloadURL(snapshot2.ref);
                const urlData = { filename: Filename, url: url };
                return urlData;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log(error);

    }

}

async function insertData(data) {
    // console.log(data);
    let { creatorid, creatorname, category, coursename, description, videolink, bannerimage, pdf, totalenrolments } = data;

    const pdfurl = await getFileUrl(pdf, 'pdf');
    const imgurl = await getFileUrl(bannerimage, 'img');


    if (pdfurl !== null) pdf = JSON.stringify(pdfurl);
    if (imgurl !== null) bannerimage = JSON.stringify(imgurl);

    const client = await pool.connect();

    try {

        const query = `INSERT INTO courses (creatorid,creatorname,category,coursename,description,videolink,bannerimage,pdf,totalenrolments) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;
        const values = [creatorid, creatorname, category, coursename, description, videolink, bannerimage, pdf, totalenrolments];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error);

    } finally {
        client.release();
    }
}

async function insertExamData(data) {

    const { courseid, creatorid, quiz, assignment } = data;
    const client = await pool.connect();
    try {

        const query = `INSERT INTO exams (courseid,creatorid,quiz,assignment) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const values = [courseid, creatorid, quiz, assignment];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error);

    } finally {
        client.release();
    }
}

async function fetchExamData(creatorId, courseId) {
    try {
        const q = 'SELECT * FROM exams WHERE creatorid = $1 AND courseid = $2;'
        const values = [creatorId, courseId];
        const { rows } = await pool.query(q, values);
        return rows;


    } catch (error) {
        console.log(error);

    }
}

async function fetchQuizOfCourseId(id) {

    try {
        const q = 'SELECT quiz FROM exams WHERE courseid = $1;'
        const values = [id];
        const { rows } = await pool.query(q, values);

        return rows[0].quiz['question'];


    } catch (error) {
        console.log(error);

    }
}

async function fetchAssignmentOfCourseId(id) {

    try {
        const q = 'SELECT assignment FROM exams WHERE courseid = $1;'
        const values = [id];
        const { rows } = await pool.query(q, values);
        return rows[0].assignment['question'];

    } catch (error) {
        console.log(error);

    }
}

async function fetchAllCourse() {

    try {
        const result = await pool.query('SELECT * FROM courses');
        return result.rows;

    } catch (error) {
        console.log(error);

    }
}

async function fetchCreatorsCourse(id) {
    try {

        const q = `SELECT * FROM courses where creatorid = $1;`
        values = [id]
        const { rows } = await pool.query(q, values);
        return rows;
    } catch (error) {
        console.log(error);

    }
}

async function fetchSingleCourse(id) {
    try {

        const q = `SELECT * FROM courses where id = $1;`
        values = [id]
        const { rows } = await pool.query(q, values);
        return rows[0];
    } catch (error) {
        console.log(error);

    }
}

async function deleteOne(id) {
    try {
        const q = `DELETE FROM courses WHERE id = $1`;
        const value = [id];
        const result = await pool.query(q, value);

        const q2 = `DELETE FROM exams WHERE courseid= $1`;
        const value2 = [id];
        const result2 = await pool.query(q, value);

        const q3 = `DELETE FROM progress WHERE courseid= $1`;
        const value3 = [id];
        const result3 = await pool.query(q, value);
        return;
    } catch (error) {
        console.log(error);

    }
}

async function updateTotalEnrollment(num, courseId) {
    try {
        const q = `UPDATE courses SET totalenrolments = $1 WHERE id = $2;`;
        const value = [num, courseId];
        const result = await pool.query(q, value);
        return result.rowCount;

    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    insertData,
    fetchAllCourse,
    fetchCreatorsCourse,
    insertExamData,
    fetchExamData,
    fetchQuizOfCourseId,
    fetchAssignmentOfCourseId,
    fetchSingleCourse,
    deleteOne,
    updateTotalEnrollment
};