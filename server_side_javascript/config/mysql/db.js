module.exports = function() {
	var mysql      = require('mysql');
	var con = mysql.createConnection({
	  host     : 'sql.computerstudi.es',
	  user     : 'gc200320739',
	  password : 'suXabtJE',
	  database : 'gc200320739',
	});
	con.connect();
	return con;
}