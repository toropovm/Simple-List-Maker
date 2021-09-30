
//DEFAULT CODE

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")
const _ = require("lodash");


//const port = 9999;
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mykola:Flyinghalo90@cluster0.ifye0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistBD", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcom to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item"
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});


const defaultItems = [item1, item2, item3];

const listSchema  = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


// let items = [];
// let workItems = [];

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("Successfully saved deafualt items to database.");
        }
      });
      res.redirect("/");
    } else {
    console.log(foundItems);
    res.render("list", {listTitle: "Today", NewListItem: foundItems});
    }
  });
  //res.send("Hello");

  // let day = "";


  //var dayColor = "";

  // if(today.getDay() === 6 || today.getDay() === 0) {
  //
  //   // res.write("<h1>YAY it's the weekend</h1>");
  //   day = "Weekend!";
  // }
  // else {
  //
  //   // res.write("<p>BOO ITS NOT THE WEEKEND</p>")
  //   // res.write("<h1>BOO ITS NOT THE WEEKEND</h1>")
  //   // res.send();
  //   // res.sendFile(__dirname + "/index.html");
  //   day = "Weekday!"
  // }

  // if(currentDay === 0) {
  //   day = "Sunday";
  // }
  // else if(currentDay === 1) {
  //   day = "Monday";
  // }
  // else if(currentDay === 2) {
  //   day = "Tuesday";
  // }
  // else if(currentDay === 3) {
  //   day = "Wednesday";
  // }
  // else if(currentDay === 4) {
  //   day = "Thursday";
  // }
  // else if(currentDay === 5) {
  //   day = "Friday";
  // }
  // else if(currentDay === 6) {
  //   day = "Saturday";
  // }
  // else {
  //   console.log("ERROR: Current day is equal to: " + currentDay);
  // }
  //passed in the end similar to a return after some logic


  //let day = date.getDate();

});

app.post("/", (req, res) => {
  // let item = req.body.newItem;

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if(listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

  // res.redirect("/");

  // redirect

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work")
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }


  // console.log(item);

  // items.push(item);
  //
  // res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today" ) {
    Item.findByIdAndRemove(checkItemId, (err) => {
      if(!err) {
        console.log("Successfully Deleted");
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkItemId}}}, (err, foundList) => {
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }


});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if(!err) {
      if(!foundList) {
        //New List
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName)
      } else {
        //Existing list
        res.render("list", {listTitle: foundList.name, NewListItem: foundList.items});
      }
    }
  });

  // const list = new List({
  //   name: customListName,
  //   items: defaultItems
  // });
  // list.save();
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/work", () => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9999;
}
app.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
