//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mega:Megaadmin%401234@cluster0.qxvixn2.mongodb.net/todolistDB");

const itemSchema = {
  name:String
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
name:"Running"
})

const item2 = new Item({
name:"Bathing"
})

const item3 = new Item({
name:"Cooking"
})

const defaultItems = [item1,item2,item3];

const listSchema={
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/:custom",function(req,res){
  const custom=req.params.custom;
List.findOne({name:custom},function(err,foundList){
  if(!err){
    if(!foundList){
      const list = new List({
        name: custom,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+custom)
    }else{
     res.render("list" ,{listTitle: foundList.name, newListItems: foundList.items});
    }
  }
});
  
});

app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
if(foundItems.length===0){
  Item.insertMany(defaultItems,function(err,docs){});
  res.redirect("/");
}
res.render("list", {listTitle: "Today", newListItems: foundItems});
  });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
const item = new Item({
  name: itemName
});

if(listName==="Today"){
item.save();
res.redirect("/");
}
else{
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}
});

app.post("/delete",function(req,res){
const checkedItemId=req.body.checkbox;
const listName=req.body.listName;

if(listName==="Today"){
Item.findByIdAndRemove(checkedItemId,function(){
  if(!err){
  res.redirect("/");
  }
});
}
else{
List.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkedItemId}}},function(err,foundList){
  if(!err){
    res.redirect("/"+listName);
  }
})
}

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
