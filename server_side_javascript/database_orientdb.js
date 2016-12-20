var Oriento = require('orientjs');

var server = Oriento({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'wjdfmd8412'
});
var db = server.use('testDB');

// db.record.get('#22:0').then(function (record) {
// 	console.log('Loaded record: ', record);
// });

//Create
// var sql = 'select from topic';
// db.query(sql).then(function(results) {
// 	console.log(results);
// });

// var sql = 'select from topic where @rid=:rid';
// var param = {
// 	params: {
// 		rid: '#22:0'
// 	}
// };
// db.query(sql, param).then(function(results) {
// 	console.log(results);
// });

//Insert

// var sql = 'insert into topic (title, description) values (:title, :desc)';
// db.query(sql, { 
// 	params: {
// 		title: 'Express',
// 		desc: 'Express is'
// 	}}).then(function(results) {
// 		console.log(results);
// })

//Update
// var sql = 'update topic set title=:title where @rid=:rid';
// db.query(sql, {params : { title: 'Express changed', rid: '#21:1'}}).then(function(results) {
// 	console.log(results);
// });

//Delete
var sql = 'delete from topic where @rid=:rid';
db.query(sql, {params: {rid: '#22:0'}}).then(function(results) {
	console.log(results);
});