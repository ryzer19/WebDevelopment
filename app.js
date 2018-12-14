var express = require("express"); // This line calls the express module
var app = express(); //invoke express application

var fs = require('fs');

//var mysql = require('mysql'); // allow access to sql

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// we need some way for the app to know where to look
app.use(express.static("views"));

app.use(express.static("scripts"));

app.use(express.static("model"));


//const db = mysql.createConnection({
 
// host: 'den1.mysql2.gear.host',
// user: 'ryan',
// password: 'Em6o9H!Td-Wc',
// database: 'ryan'
  
//});

//db.connect((err) =>{
// if(err){
//  console.log("Connection Refused ... Please check login details");
   // throw(err)
// }
// else{
//  console.log("Well done you are connected....");
// }
// });

var contact = require("./model/contact.json") // Allow access to contact json file
var review = require("./model/review.json") // Allow access to review json file


// route to render index page 
app.get("/", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("index.ejs");
    console.log("on home page")
    
});

// route to render products page 
app.get("/products", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("products.ejs");
    console.log("on products page")
    
});


// route to render newsletter subscription page
app.get("/newsletter", function(req, res){
    
   // res.send("You are on the newsletter page");
    res.render("newsletter.ejs", {contact});
    console.log("on newsletter page!")
    
});

// route to render contact request page
app.get("/contacts", function(req, res){
    
   // res.send("You are on the contacts page");
    res.render("contacts.ejs", {contact});
    console.log("on contacts page!")
    
});

// route to render contact info page 
app.get("/addcontacts", function(req, res){
    
   // res.send("You are on the add contacts page");
    res.render("addcontact.ejs");
    console.log("on add contacts page!")
    
});

// route to render add review
app.get("/reviews", function(req, res){
    
   // res.send("You are on the reviews page");
    res.render("reviews.ejs", {review});
    console.log("on reviews page!")
    
});

// route to render reviews 
app.get("/addreview", function(req, res){
    
   // res.send("You are on the add reviews page");
    res.render("addreview.ejs");
    console.log("on add review page!")
    
});


// route to render contact info page 
app.post("/addcontact", function(req, res){
    
    // function to find the max id
    
  	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	

	
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    comment: req.body.comment,
    email: req.body.email
    
  };
    
     console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  //reads the new data and pushes it into  JSON file
  
  fs.readFile('./model/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4);
      fs.writeFile('./model/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contacts");
    
    
});




app.post('/add', function(req, res){
	var count = Object.keys(contact).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    comment: req.body.comment,
    email: req.body.email
    
  };
  
  console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./models/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contact");
  
});


// get the edit page

app.get('/editcontact/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
 console.log("Id of this contact is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indOne = contact.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne
 res.render('editcontact.ejs' , {indOne:indOne});
  console.log("Edit contact page Shown");
 });




// Create post request to edit the individual review
app.post('/editcontact/:id', function(req, res){
 var json = JSON.stringify(contact);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = contact; // declare data as the reviews json file
  var index = data.map(function(contact) {return contact.id;}).indexOf(keyToFind)
 //var index = data.map(function(contact){contact.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.comment
 var z = parseInt(req.params.id)
 contact.splice(index, 1, {name: req.body.name, comment: y, id: z, email: req.body.email});
 json = JSON.stringify(contact, null, 4);
 fs.writeFile('./model/contact.json', json, 'utf8'); // Write the file back
 res.redirect("/contacts");
});






// url to delete JSON

app.get("/deletecontact/:id", function(req, res){
    
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = contact; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  contact.splice(index, 1);
  json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
  res.redirect("/contacts");
    
});

// route to render contact info page 
app.get("/addcontact", function(req, res){
    
   // res.send("You are on the add contacts page");
    res.render("addcontact.ejs");
    console.log("on add contacts page!")
    
});


// route to render contact info page 
app.post("/addcontact", function(req, res){
    
    // function to find the max id
    
  	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    comment: req.body.comment,
    email: req.body.email
    
  };
    
     console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  //reads the new data and pushes it into  JSON file
  
  fs.readFile('./model/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4);
      fs.writeFile('./model/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contacts");
    
    
});

//REVIEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

// route to render add review page 
app.post("/addreview", function(req, res){
    
    // function to find the max id
    
  	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(review[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}

	var maxPpg = getMax(review, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var reviewsx = {
    name: req.body.name,
    id: newId,
    review: req.body.review,
    email: req.body.email
    
  };
    
     console.log(reviewsx);
  var json = JSON.stringify(review); // Convert our json data to a string
  
  //reads the new data and pushes it into  JSON file
  
  fs.readFile('./model/review.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      review.push(reviewsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(review, null, 4);
      fs.writeFile('./model/review.json', json, 'utf8')
    }
    
  })
  res.redirect("/reviews");
    
    
});




app.post('/add', function(req, res){
	var count = Object.keys(review).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(review[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(review, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var reviewsx = {
    name: req.body.name,
    id: newId,
    review: req.body.review,
    email: req.body.email
    
  };
  
  console.log(reviewsx);
  var json = JSON.stringify(review); // Convert our json data to a string
  
// The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./models/review.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      review.push(reviewsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(review, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/review.json', json, 'utf8')
    }
    
  })
  res.redirect("/review");
  
});


// get the edit page

app.get('/editreview/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
 console.log("Id of this review is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indOne = review.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne
 res.render('editreview.ejs' , {indOne:indOne});
  console.log("Edit review page Shown");
 });




// Create post request to edit the individual review
app.post('/editreview/:id', function(req, res){
 var json = JSON.stringify(review);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = review; // declare data as the reviews json file
  var index = data.map(function(review) {return review.id;}).indexOf(keyToFind)
 //var index = data.map(function(review){review.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.review
 var z = parseInt(req.params.id)
 review.splice(index, 1, {name: req.body.name, review: y, id: z, email: req.body.email});
 json = JSON.stringify(review, null, 4);
 fs.writeFile('./model/review.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
});






// url to delete JSON

app.get("/deletereview/:id", function(req, res){
    
  var json = JSON.stringify(review); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = review; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  review.splice(index, 1);
  json = JSON.stringify(review, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/review.json', json, 'utf8')
  res.redirect("/reviews");
    
});

// route to render review info page 
app.get("/addreview", function(req, res){
    
   // res.send("You are on the add reviews page");
    res.render("addreview.ejs");
    console.log("on add reviews page!")
    
});


// route to render review info page 
app.post("/addreview", function(req, res){
    
    // function to find the max id
    
  	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(review[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(review, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var reviewsx = {
    name: req.body.name,
    id: newId,
    review: req.body.review,
    email: req.body.email
    
  };
    
     console.log(reviewsx);
  var json = JSON.stringify(review); // Convert our json data to a string
  
  //reads the new data and pushes it into  JSON file
  
  fs.readFile('./model/review.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      review.push(reviewsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(review, null, 4);
      fs.writeFile('./model/review.json', json, 'utf8')
    }
    
  })
  res.redirect("/reviews");
    
    
});





// Now we need to tell the application where to run


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("running.");
  
})

