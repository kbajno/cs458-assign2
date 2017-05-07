'use strict';
console.log('Loading function');
var mysql = require('mysql');

/*
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
*/

module.exports.getEnvData =(event, context, callback) => {
    console.log('Recieved event: ', JSON.stringify(event, null, 2));
    var year = event.year;
    
    var conn = mysql.createConnection({
        host: 'infovizhw2.cxemmgjlcvb6.us-west-2.rds.amazonaws.com',
        user: 'root',
        password: 'pp00oo99',
        database: 'innodb'
    });
    
    console.log("Connecting to sql db...");

    conn.connect(function(err){
      if(err){
          console.error('Error connecting: ' + err.stack);
          return;
      }
      console.log('Connected as id: ' + conn.threadId);
    });
    
    
      var sql = 'SELECT * FROM infovizhw WHERE year= "' + year + '"';
      console.log("Sql query: " + sql);
      var result = conn.query(sql, function(error, rows, fields){
        if(error){
          console.log(error.message);
          throw error;
        } else {
          context.succeed(rows);
        }
      });
}
