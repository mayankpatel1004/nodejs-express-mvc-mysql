const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into registration(firstName,lastName,gender,email,password,number) values (?,?,?,?,?,?)`,
            [data.first_name,data.last_name,data.gender,data.email,data.password,data.number],(error, results, fields) => {
                if(error) {
                    console.log("Insert Error",error.code);
                    if(error.code == 'ER_DUP_ENTRY'){
                        return callBack(error.code)
                    } else {
                        return callBack(error)
                    }          
                }
                // Email script start //
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'mayank.patel.developer@gmail.com',
                      pass: 'XXXXXX'
                    }
                });
                var mailOptions = {
                    from: 'mayank.patel.developer@gmail.com',
                    to: 'mayankp@yopmail.com',
                    subject: 'Thank you for your registration on our web portal',
                    text: `Hi User, thank you for your registration on our portal.
                            You can access your account as per your expectations<br /><h4>Thank you.</h4>.`
                    //html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>';
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                return callBack(null, results)
            }
        );
    },
    getUsers: callBack => {
        pool.query(
            `select id,firstName,lastName,gender,email,number from registration`,
            [],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    excelRead: callBack => {
        var xlsx = require("xlsx");
        var wb = xlsx.readFile('uploads/sample.xlsx',{cellDates:true});
        var ws = wb.Sheets["Rex-Liquor-Data"];
        var data = xlsx.utils.sheet_to_json(ws);
        var newData = data.map(function(record){
            record.Net = record.Cost - record.Sales;
            delete record.Sales;
            delete record.Cost;
            return record;
        });
        return callBack(null, newData);
        
    },
    excelWrite: callBack => {
        var xlsx = require("xlsx");
        var wb = xlsx.readFile('uploads/sample.xlsx',{cellDates:true});
        var ws = wb.Sheets["sheet1"];
        var data = xlsx.utils.sheet_to_json(ws);
        var newData = data.map(function(record){
            record.Net = record.Cost - record.Sales;
            delete record.Sales;
            delete record.Cost;
            return record;
        });
        var newWB = xlsx.utils.book_new();
        var newWS = xlsx.utils.json_to_sheet(newData);
        xlsx.utils.book_append_sheet(newWB,newWS,"New");
        xlsx.writeFile(newWB,"uploads/New"+Date.now()+".xlsx");
        return callBack(null, newData);
    },
    exportUsers: callBack => {
        var xlsx = require("xlsx");
        pool.query(
            `select id,firstName,lastName,gender,email,number from registration`,
            [],
            (error, results, fields) => {
                if(error){
                    callBack(error);
                }
                var newWB = xlsx.utils.book_new();
                var newWS = xlsx.utils.json_to_sheet(results);
                xlsx.utils.book_append_sheet(newWB,newWS,"New");
                xlsx.writeFile(newWB,"uploads/Users_"+Date.now()+".xlsx");
                return callBack(null, results);
            }
        );
    },
    exportUsersPdf: callBack => {
        //const PDFDocument = require('pdfkit');
        //const fs = require('fs');
        // const doc = new PDFDocument();
        //const content = '<table><tr><th>No.</th><th>Name</th><th>Number</th><th>Status</th></tr><tr><td>1</td><td>Mayank</td><td>23</td><td>Active</td></tr></table>';
        // doc.pipe(fs.createWriteStream('uploads/users.pdf'));
        // doc.fontSize(20).text(content);
        // doc.end();
        var PDFDocument = require('pdfkit');
        var fs=require('fs');
        doc = new PDFDocument();
        x1=doc.x;
        x6=310;
        doc.rect(doc.x, doc.y, 450, 65)
        .moveTo(300, doc.y).lineTo(300, doc.y+65)
        .moveDown(0.2)
        
        .text('Member Name',{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
        .rect(x1,doc.y,450,0.5)
        .moveUp()
        .text("Mayank",x6,doc.y)
        .moveDown(0.2)
        
        .text('Member ID',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
        .rect(x1,doc.y,450,0.5)
        .moveUp()
        .text("1",x6,doc.y)
        .moveDown(0.2)
        
        .text('Member DOB',x1,doc.y,{indent:5, align:'left'})
        .rect(x1,doc.y,450,0.5)
        .moveUp()
        .text("2020-11-11",x6,doc.y)
        .moveDown(0.2)
        
        .text('Baby Due Date',x1,doc.y,{indent:5, align:'left'})
        .moveUp()
        .text("2020-11-11",x6,doc.y)
        .stroke()
        .moveDown(1.5);
        
        doc.pipe(fs.createWriteStream('uploads/users.pdf'));
        doc.end();





        
        return callBack(null, {});
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `select id,firstName,lastName,gender,email,number from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if(error){
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    updateUser: (data, callBack) => {
        pool.query(
            `UPDATE registration SET firstName=?, lastName=?, gender=?, number=? WHERE id = ?`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.number,
                data.id
            ],
            (error, results, fields) => {
                console.log("Results ===>",results);
                if(error){
                    console.log("Update User Error ==>",error);
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deleteUser: (data, callBack) => {
        //console.log("Service called ===>",data);
        pool.query(
            `delete from registration where id = ?`,
            [data.id],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getUserByUserEmail: (email, callBack) => {
        pool.query(
            `select * from registration where email = ?`,
            [email],
            (error, results, fields) => {
                if(error){
                    console.log(error);
                    callBack(error);
                    return;
                }
                return callBack(null, results[0]);
            }
        );
    }
};