var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var mysql      = require('mysql');
var cookie = require('cookie');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port: '8889',
    database: 'ajaxdemo'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


var app = http.createServer(function(req, res) {
    // res.write("Hello World");
    // res.end();
    var url_obj = url.parse(req.url);
    if(url_obj.pathname === '/'){
        render("./template/index.html", res);
        return;
    }
    if(url_obj.pathname === "/register" && req.method === "POST"){
        // res.write('{"name:":"hello world"}');
        // res.end();
        var user_info = '';
        req.on("data", function(chunk){
            user_info += chunk;
        });
        req.on("end", function(err){
            if(!err){
                console.log(user_info);
                var user_obj = querystring.parse(user_info);
                if(user_obj.username === ''|| user_obj.password === ''){
                    res.write('{"status": 1, "message": "Both username and password cannot be blank!"}', 'utf-8');
                    res.end();
                    return;
                }
                if(user_obj.password != user_obj.repassword) {
                    res.write('{"status": 1, "message": "Password different!"}', 'utf-8');
                    res.end();
                    return;
                }
                var sql = 'INSERT INTO admin(username, password) VALUES ("'+user_obj.username+'", "'+user_obj.password+'");';
                connection.query(sql, function(err, result){
                    // console.log(err);
                    // console.log(result);
                    if(!err && result && result.length !== 0){
                        res.write('{"status": 0, "message": "Successful Registration!"}', 'utf-8');

                        res.end();
                        return;
                    }
                });
            }
        });
        return;
    }
    if(url_obj.pathname === "/login" && req.method === "POST"){
        var user_info = '';
        req.on("data", function(chunk){
            user_info += chunk;
        });
        req.on("end", function(err){
            if(!err){
                console.log("USERINFO: "+ user_info);
                var user_obj = querystring.parse(user_info);
                var sql = "select * from admin where username='"+user_obj.username+"' AND password='"+user_obj.password+"';";
                connection.query(sql, function(error, result){
                    console.log("RESULT: "+ result);
                    console.log("ERROR: "+ error);
                    console.log("SQL: "+ sql);
                    if(!error && result && result.length !== 0){
                        res.setHeader('Set-Cookie', cookie.serialize('isLogin', "true"));
                        res.write('{"status": 0, "message": "Successful Sign In!"}', 'utf-8');
                        res.end();
                    } else {
                        res.write('{"status": 1, "message": "Username or password incorrect!"}', 'utf-8');
                        res.end();
                    }
                });

                return;
            }
        })
    }
    if(url_obj.pathname === '/list' && req.method === 'GET') {
        // console.log("111111111");
        var sql = "SELECT * FROM user";
        connection.query(sql, function(error, result){
            console.log("ERROR: "+error);
            console.log("RESULT: " + result);
            if(!error && result){
                var arrstr = JSON.stringify(result);
                console.log(arrstr);
                res.write('{"status": 0, "data": '+arrstr+'}', 'utf-8');
                res.end();
                return;
            }
        });
    }
    if(url_obj.pathname === "/adduser" && req.method === "POST") {
        console.log("UUUUUUUUUUU");
        var user_info = '';
        req.on("data", function(chunk){
            user_info += chunk;
        });
        req.on("end", function(err){
            if(!err){
                var user_obj = querystring.parse(user_info);
                var sql = 'INSERT INTO user (username, email, phone, qq) VALUES ("'+user_obj.username+'", "'+user_obj.email
                +'", "'+user_obj.phone+'", "'+user_obj.qq+'")';
                console.log(sql);
                connection.query(sql, function(error, result){
                    if(!error && result && result.length !== 0){
                        res.write('{"status": 0, "message": "New record inserted successfully"}', 'utf-8');
                        res.end();
                        return;
                    } else {
                        res.write('{"status": 1, "message": "Failed to insert new record"}', 'utf-8');
                        res.end();
                        return;
                    }
                })
            }
        })
    }
    if(url_obj.pathname === "/update" && req.method === "POST"){
        // res.write('{"status": 0, "message": "Hello Wollongong"}', 'utf-8');
        // res.end();
        var user_info = '';
        req.on("data", function(chunk){
            user_info += chunk;
        });
        req.on("end", function(error){
            if(!error){
                var user_obj = querystring.parse(user_info);
                var sql = 'UPDATE user SET username="'+user_obj.username+'", phone="'+user_obj.phone+'", email="'+user_obj.email+
                    '", qq="'+user_obj.qq+'" WHERE id="'+user_obj.id+'"';
                console.log(sql);
                connection.query(sql, function(error, result){
                    if(!error && result && result.length !== 0){
                        res.write('{"status": 0, "message": "Updated successfully."}', 'utf-8');
                        res.end();
                        return;
                    } else {
                        res.write('{"status": 1, "message": "Error(s) occurred when updating info. "}', 'utf-8');
                        res.end();
                        return;
                    }
                })
            }
        })
        return;
    }
    if(url_obj.pathname === "/delete" && req.method === "POST"){
        var user_info = '';
        req.on("data", function(chunk){
            user_info += chunk;
        });
        req.on("end", function(error){
            if(!error){
                var user_obj = querystring.parse(user_info);
                var sql = 'DELETE FROM user WHERE id="'+user_obj.id+'"';
                console.log(sql);
                connection.query(sql, function(error, result){
                    if(!error && result && result.length !== 0){
                        res.write('{"status": 0, "message": "Deleted successfully."}', 'utf-8');
                        res.end();
                        return;
                    } else {
                        res.write('{"status": 1, "message": "Error(s) occurred when deleting info. "}', 'utf-8');
                        res.end();
                        return;
                    }
                })
            }

        })

    }
    if(url_obj.pathname === "/setcookie"){
        res.setHeader('Set-Cookie', cookie.serialize('aaaa', "true"));
        res.end();
    }
    if(url_obj.pathname === "/getcookie"){
        console.log("COOKIE: " + req.headers.cookie);
        var cookie_obj = cookie.parse(req.headers.cookie);
        console.log(cookie_obj);
    }
    if(url_obj.pathname === "/admin.html"){
        if(cookie.parse(req.headers.cookie || '').isLogin === "true"){
            render("./template/admin.html", res);
            return;
        } else {
            render("./template/error.html", res);
            return;
        }
    }
    if(url_obj.pathname === "/logout"){
        res.setHeader('Set-Cookie', cookie.serialize('isLogin', ""));
        render("./template/index.html", res);
        return;
    }
    render("./template"+url_obj.pathname, res);
    console.log("./template"+url_obj.pathname);
});

app.listen(3000, function(err){
    if(!err){
        console.log("listening on 3000...");
    }
});


function render(path, res){
    // if(path === './template/'){
    //     path = './template/index.html';
    // }
    fs.readFile(path, 'binary', function(err, data){
        if(!err){
            res.write(data, 'binary');
            res.end();
        }
    });
}

