console.log('Loading function');
var sql = require('mysql');

exports.handler = (event, context, callback) => {
    console.log('Recieved event: ', JSON.stringify(event, null, 2));
    var year = event.year;
    
    var conn = mysql.createConnection({
        host: 'infovizhw2.cxemmgjlcvb6.us-west-2.rds.amazonaws.com',
        user: 'root',
        password: 'pp00oo99'
    });
    
    conn.connect(function(err){
        if(err){
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log('Connected as id: ' + conn.threadId);
    });
    
    var sql = 'SELECT * FROM infovizhw WHERE state= "' + state + '"';
    var result = conn.query(sql, function(error, rows, fields){
        if(error){
            console.log(error.message);
            throw error;
        } else {
            context.succeed(rows);
        }
    })
    callback(null, 'Hello from Lambda');
};