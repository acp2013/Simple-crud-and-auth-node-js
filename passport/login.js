var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // cek pada database mongo sudah terdaftar belum
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    if (err)
                        return done(err);
                    // username tidak ditemukan
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // user ditemukan tetapi password error
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    
                    return done(null, user);
                }
            );

        })
    );

	//mencocokan password
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}