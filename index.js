const express = require('express');
const path = require('path');

const port = 9000;

const app = express();

// Importing Mongoose from the Config Dirs
const db = require('./config/mongoose');
const Contact = require('./models/contact');

// Setting View Engine AND Views Directory
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

// Express Middleware to manipulate Request and Response
app.use(express.urlencoded())

// Setting Path for assets
app.use(express.static('assets'))
// Defining Contacts List
var contactList = [
    {
        name:'Keshav',
        phone:'9900990099'
    },    
    {
        name:'Aarav',
        phone:'9911990099'
    }
]
// Sending Response to a GET Request
app.get('/',function(req,res){

    Contact.find({},function(err,ContactList){
        if(err){
            console.log("Error in fetching Contacts from the DB");
            return;
        }

        return res.render('home',{
            title:'My Contact List',
            contact_list:ContactList
        })
    })

})

app.post('/add-contact',function(req,res){
    // contactList.push(req.body)
    Contact.create({
        name:req.body.name,
        phone:req.body.phone
    },function(err,newContact){
        if(err){
            console.log("Error Detected while adding Contact in the List");
            return;
        }
        console.log(newContact);
        return res.redirect("/");
    })
})

// Controller for Deleting a Contact from List
app.get('/delete-contact/', function(req,res){
    // Code when doing without the DB
    // console.log(req.query);
    // let phone = req.query.phone;
    // let contactIndex = contactList.findIndex( contact => contact.phone == phone);
    // contactList.splice(contactIndex,1);
    // return res.redirect('back');

    //  Code when using Mongo DB
    let id = req.query.id;
    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log("Error in Deleting Contact with ID : ",id);
        }
        return res.redirect('back');
    })

})

// Listening to the Specific Port
app.listen(port, function(err){
    if(err){
        console.log("Error running server on port",err);
    }
    console.log("Express App Started on ", port)
});