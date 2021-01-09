//javascript version:es6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const items = ["Buy Food","Eat Chocolate","Drink Milk"]; //const doesnt make inner elements of the array - const array can't get declared to new array
const workItems = [];
app.get("/",function(req,res){

    const day = date.getDate();

    res.render("list",{
        listTitle:day,
        newListItems: items,
    });
});

app.get("/work",function(req,res){
    res.render("list",{
        listTitle:"Work List",
        newListItems: workItems,
    });
});

app.post("/",function(req,res){

    const item = req.body.newItem;
    if(req.body.list === "Work")
    {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.listen(3000,function(req,res){
    console.log("working on port 3000");
});