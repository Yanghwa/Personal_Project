var mysql      = require('mysql');
var con = mysql.createConnection({
	host     : 'sql.computerstudi.es',
	user     : 'gc200320739',
	password : 'suXabtJE',
	database : 'gc200320739',
});
con.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + con.threadId);
});
// var sql = "SELECT * FROM topic";
// con.query(sql, function(err, rows, fields) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		for(i = 0; i < rows.length; i++) {
// 			console.log(rows[i].title);
// 		}
// 	}

// });
// var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
// var params = ['nodejs', 'sever side javascript', 'wat']
// con.query(sql, params, function(err, rows, fields) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(rows.insertId);
// 	}
// });
// var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
// var params = ['NPM', 'Mola', 5];
// con.query(sql, params, function(err, rows, fields) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(rows);
// 	}
// });
var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
con.query(sql, params, function(err, rows, fields) {
	if(err) {
		console.log(err);
	} else {
		console.log(rows);
	}
});
con.end();