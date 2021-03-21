//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
let todoList = ['Get up', 'Eat breakfast', 'Open MacBook'];
let date = require(`${__dirname}/date.js`);
const _ = require('lodash');

// Connect to mongodb
mongoose.connect('mongodb+srv://admin-blazej:MyNewPassword123@cluster0.pmf2b.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const Item = mongoose.model('Item', itemsSchema);

const List = mongoose.model('List', listSchema);

//use EJS
app.set('view engine', 'ejs');

//use body-paser
app.use(bodyParser.urlencoded({
  extended: true
}));

//use static files like css and js on the server side
app.use(express.static('public'));

//listen on local or server PORT
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000');
});



//create new items for todolist
const item1 = new Item({
  name: 'Welcome to your todoList!'
});
const item2 = new Item({
  name: 'hit the + button to add new item'
});
const item3 = new Item({
  name: 'And you wont forget anything'
});

let itemsArray = [item1, item2, item3];
let listTypes = ['Work', "Sport"];

app.get('/', function(req, res) {

  Item.find(function(err, items) {

    if (items.length === 0) {
      Item.insertMany([item1, item2, item3], function(err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
      res.redirect('/');
    } else {
      res.render('list', {
        kindOfDay: 'Today',
        todoList: items,
        listTypes: listTypes
      });
    }
  });
});

app.post('/', function(req, res) {
  let newItem = req.body.todoItem;
  let listName = req.body.list;
  const item = new Item({
    name: newItem
  })

  if (listName === 'Today') {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${listName}`);
    })
  }
  // todoList.push(req.body.todoItem);

})



// new routes
app.get('/:newRoute', function(req, res) {


const customListName = _.capitalize(req.params.newRoute);
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {

        const list = new List({
          name: customListName,
          items: itemsArray
        })
        console.log(listTypes);
        list.save();

        // List.find({}, function(err, found) {
        //   console.log(found);
        //   listTypes = [];
        //   console.log(listTypes);
        //   found.forEach(el => {
        //     if( el.name != 'Favicon.ico' || el.name != 'Apple-touch-icon-precomposed.png' || el.name != 'Apple-touch-icon.png'){
        //       listTypes.push(el.name);
        //     }
        //
        //   })
        //   console.log(listTypes);
        // });

        res.render('list', {
          kindOfDay: list.name,
          todoList: list.items,
          listTypes: listTypes
        });
      } else {

        // List.find({}, function(err, found) {
        //   console.log(found);
        //   listTypes = [];
        //   found.forEach(el => {
        //     if(el.name != 'Favicon.ico' || el.name != 'Apple-touch-icon-precomposed.png' || el.name != 'Apple-touch-icon.png'){
        //       listTypes.push(el.name);
        //     }
        //   })
        // });

        res.render('list', {
          kindOfDay: foundList.name,
          todoList: foundList.items,
          listTypes: listTypes
        });
      }
    } else {
      console.log(err);
    }
  });





})


app.post('/delete', function(req, res) {
  console.log(req.body.checkbox);
  console.log(req.body.listName);


  if (req.body.listName === 'Today') {
    Item.findByIdAndRemove({
      _id: req.body.checkbox
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
      }

      res.redirect('/');
    })
  } else {
    List.findOneAndUpdate({
      name: req.body.listName
    }, {
      $pull: {
        items: {
          _id: req.body.checkbox
        }
      }
    }, function(err, foundList) {
      if(!err) {
        res.redirect(`/${req.body.listName}`);
      }

    })
  }
});
