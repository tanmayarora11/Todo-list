//javascript version:es6

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

const app = express();
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item",itemsSchema);

const todo1 = new Item({
    name : "Welcome to the List"
});

const todo2 = new Item({
    name : "Hit + to add new Item"
});

const todo3 = new Item({
    name : "<-- Hit checkbox to delete"
});

const defaultItems = [todo1,todo2,todo3];

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema]
});

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
            if(err)
            {
                console.log(err);
            }
            else console.log("Successfully added to todolist");
        });
            res.redirect("/");
        }
        else{
            res.render("list",{
                listTitle:"Today",
                newListItems: foundItems,
            });
        }  
    })
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else {
                    res.render("list",{
                    listTitle: foundList.name,
                    newListItems: foundList.items,
                });
            }
        }

    });
    

});

app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name:itemName
    });
    
    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
    
});

app.post("/delete",function(req,res){
    const checkedId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedId,function(err){
        if(err){
            console.log(err);
        }
        else {
            console.log("successful deletion");
            res.redirect("/");
        }
        });
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items: {_id:checkedId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }
    
})

mongoose.set('useFindAndModify', false);

app.listen(3050,function(){
    console.log("working on port 3050");
});

