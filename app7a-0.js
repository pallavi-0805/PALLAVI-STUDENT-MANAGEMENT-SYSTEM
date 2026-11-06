//CURD operations of students table of school database
/*
1. Initialize PROJECT
>npm init -y
The above command will initialize the project and will 
create a file package.json

2. >npm install express mysql8
Install express mysql8 in current folder

EXECUTION: To open index.html
GET http://localhost:3000/
*/
const express = require("express");
const mysql = require("mysql8");
const app = express();
app.use(express.json());
// Read HTML files from public folder
app.use(express.static("public"));

//Connection establishment with school database
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "Palla@2006",
    database: "school"
});

db.connect((err)=>{
    if(err)
        throw err;
    console.log("Connected to MySQL");
});

//TO GET DETAILS OF ALL STUDENTS
app.get("/students",(req,res)=>{

    db.query(
        "SELECT * FROM student",
        (err,result)=>{

            if(err) throw err;

            res.json(result);

        });

});
//TO GET THE DETAILS OF ONE STUDENT
app.get("/students/:sno",(req,res)=>{

    db.query(
        "SELECT * FROM student WHERE student_id=?",
        [req.params.sno],
        (err,result)=>{

            if(err) throw err;

            res.json(result);

        });

});

//TO INSERT STUDENT DATA INTO students TABLE
app.post("/students",(req,res)=>{
        const {sno,name,total,age,phone}=req.body;
    db.query(
        "INSERT INTO student(student_id,student_name,total,age,phone) VALUES(?,?,?,?,?)",
        [sno,name,total,age,phone],
        (err)=>{
            if(err)
            {   res.status(500).send(err.message);
                return;
            }
            res.send("Student Inserted");
        });

});

//TO UPDATE STUDENT DETAILS
app.put("/students/:id", (req, res) => {

    const id = req.params.id;

    const { student_name, total, age, phone } = req.body;

    const sql = `
        UPDATE student
        SET student_name = ?,
            total = ?,
            age = ?,
            phone = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [student_name, total, age, phone, id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student not found");
            }

            res.send("Student updated successfully!");

        }
    );

});

//TO DELETE STUDENT DETAILS
app.delete("/students/:sno",(req,res)=>{

    db.query(
        "DELETE FROM student WHERE student_id=?",
        [req.params.sno],
        (err,result)=>{
            if(err)
            {
                res.status(500).send(err.message);
                return;
            }

            if(result.affectedRows==0)
                res.status(404).send("Student NOT found to delete");
            else
                res.send("Student Deleted");

        });

});

//Server to listen of port number 3000
app.listen(3000,()=>{

    console.log("Server running at http://localhost:3000");

});