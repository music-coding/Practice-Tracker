var express = require('express');
var router = express.Router();
var Log = require('../models/log');
var User = require('../models/user');
var Todo = require('../models/todo');
var mid = require('../middleware');



//get students for Eva
router.param("user", function(req,res,next,name){
     if(req.session.userId === "58e4f2cb75d58d0f4ce69f4e"){
       User.find({name: name}, function(err, doc){
        if(err) return next(err);
        if(!doc) {
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
        }
        req.question = doc;
        return next();
      });
     }

});

// GET /users
// Route for users collection
router.get("/logg", function(req, res, next){
	   User.find({})
				.sort({createdAt: -1})
				.exec(function(err, questions){
					if(err) return next(err);
					res.json(questions);
		 });
});





//Get /todolist   I have this set to getting the logs for now until I change it to do list
//
// router.get('/todo',mid.requiresLogin, function(req, res, next){
//   if(req.session.userId === "58e4f2cb75d58d0f4ce69f4e"){
//     Todo.find({}, function(err, docs) {
//         if(err) {
//         return res.json(err);
//       }  else {
//         return res.render('todo', {todos: docs});
//       }
//     });
//   }
//
//   else if(req.session.userId !== "58e4f2cb75d58d0f4ce69f4e") {
//     Todo.find({'id':req.session.userId}, function(err, docs) {
//         if(err) {
//         return res.json(err);
//       }  else {
//         return res.render('todo', {todos: docs})
//       }
//     });
//     }
// });
//
//
//
// //POST /todo   figure out how to post to do list
// router.post('/todo', function(req, res, next){
//
//       if(req.body.task) {
//         var todoData = {
//           task: req.body.task,
//           id: req.session.userId }
//
//       Todo.create(todoData, function (error, log) {
//               if (error) {
//                 return next(error);
//               } else {
//                 console.log('logged');
//                 return res.redirect('/todo');
//               }
//       });
//   }
//
//     else {
//       return res.send('all fields required');
//     }
//
//
// })



// GET /index
router.get('/index',mid.requiresLogin, function(req, res, next){
  User.findById(req.session.userId)
  return res.render('index', { title: 'Index' });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        req.session.name = user.name;
        req.session.role = user.role;
        return res.redirect('/index');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});



//POST /index
router.post('/index', function(req, res, next){
   if(req.body.day && req.body.time){
     // create object with form input
        var logData = {
          day: req.body.day,
          time: req.body.time,
          id: req.session.userId,
        };

    Log.create(logData, function (error, log) {
        if (error) {
          return next(error);
        } else {
          console.log('logged');
          return res.redirect('/log');
        }
      });

   }  else {
     return res.send('all fields required');
   }
})

//GET register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

//POST register
router.post('/register', function(req, res, next){

   if(req.body.email &&
       req.body.name &&
      req.body.password &&
      req.body.instrument) {
        // create object with form input

          var userData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            instrument: req.body.instrument
          };

          console.log(userData)

          // use schema's `create` method to insert document into Mongo
          User.create(userData, function (error, user) {
            if (error) {
              return next(error);
            } else {
              return res.redirect('/login')
          }
      });

      }  else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})


//GET logs
router.get('/log', function(req, res, next){



  if(req.session.role === "admin"){
    User.find({}, function(err, docs) {
        if(err) {
        return res.json(err);
      }  else {
        return res.render('log', {users: docs});
      }
    });
  }

  else if(req.session.role !== "admin") {


    Log.find({'id':req.session.userId}, function(err, docs) {
        if(err) {
        return res.json(err);
      }  else {
        return res.render('log', {logs: docs})
      }
    });
    }
})
//   return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
// res.send({logs: docs});


// GET /
router.get('/', function(req, res, next) {

   if(mid.loggedOut){
     return res.render('register', {title: 'register'});
   }  else if (!mid.loggedOut) {
       return res.render('index', { title: 'Home' });
   }

});

// GET /questions/:id
// Route for specific questions
router.get("/:user", function(req, res, next){

  Log.find({'id': req.question[0].id}, function(err, docs) {
      if(err) {
      return res.json(err);
    }  else {
      return res.render('studentLog',{logs: docs})
    }
  });

  // res.json(req.question);
});



module.exports = router;
