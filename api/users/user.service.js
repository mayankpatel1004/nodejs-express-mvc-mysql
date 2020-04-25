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
        var wb = xlsx.readFile('/home/digiflux/Documents/work/practice/mayank-practice/uploads/rex.xlsx',{cellDates:true});
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
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument();
        const content = '<table><tr><th>No.</th><th>Name</th><th>Number</th><th>Status</th></tr><tr><td>1</td><td>Mayank</td><td>23</td><td>Active</td></tr></table>';
        doc.pipe(fs.createWriteStream('uploads/users.pdf'));
        doc.fontSize(20).text(content);
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