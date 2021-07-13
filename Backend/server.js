const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()

let cors = require("cors")
let port = 4000

app.use(cors())
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017/timetables", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let tableSchema = {
  name: String,
  m: Array,
  t: Array,
  w: Array,
  th: Array,
  f: Array,
  s: Array,
  su: Array
}

const Table = mongoose.model("tables", tableSchema)


app.get("/tableExists/:id", (req, res) => {
  Table.findOne({name:req.params.id}).then(r => {
    if (r) {
      res.json(true)
    } else {
      res.json(false)
    }
  })
})

// Creates a new table
app.post("/createTable", (req, res) => {
  table = new Table(req.body)
  table.save().then(table => { res.json(table)
  }).catch(err => { console.log(err)})
})

app.get("/table/:id", (req, res) => {
  Table.findOne({name: req.params.id}).then(r => {
    res.json(r)
  })
})

app.post("/addSession/:id", (req, res) => {
  let newDay = req.body.d
  let t = req.body.title
  Table.findOne({name:req.params.id}, (err, table) => {
    // Now we have the table, need to find the right day to add to
    switch (t) {
      case "Monday":
        table.m = newDay
        break;
      case "Tuesday":
        table.t = newDay
        break;
      case "Wednesday":
        table.w = newDay
        break;
      case "Thursday":
        table.th = newDay
        break;
      case "Friday":
        table.f = newDay
        break;
      case "Saturday":
        table.s = newDay
        break;
      case "Sunday":
        table.su = newDay
        break;
      default:
        console.log('Funky day',t)
        break;
    }
    table.save().then(table => {}).catch(err => {
      console.log(err)
    })
  })
})

// Temporary to test, soon add ^^ will be used to save each one
app.post("/updateWeek", (req, res) => {
  Table.findOne({name:req.body.id}, (err, day) => {
    if (!day) {
      console.log(err)
    } else {
      let x = req.body.content
      day.m = x[0].sessions
      day.t = x[1].sessions
      day.w = x[2].sessions
      day.th = x[3].sessions
      day.f = x[4].sessions
      day.s = x[5].sessions
      day.su = x[6].sessions
      day.save().then(day => {}).catch(err => {
        console.log(err)
      })
    }
  })
})

app.get("/getAllTables", (req, res) => {
  Table.find({}, (err, tables) => {
    if (err) {
      res.json("Some error in retrieving table")
    } else {
      temp = []
      for (let i = 0; i < tables.length; i++) {
        temp.push(tables[i].name)
      }
      res.json(temp)
    }
  })
})

app.delete("/delete/:id", (req, res) => {
  console.log(req.params.id)
  Table.deleteOne({name: req.params.id}, (err) => {
    if(err) {res.json(false)} else {res.json(true)}
  })
})

// To Do List functions
let listSchema = {
  title: String,
  completed: Array,
  inCompleted: Array
}

let List = mongoose.model("lists", listSchema)

app.get("/listExists/:id", (req, res) => {
  List.findOne({title:req.params.id}).then(r => {
    if (r) {
      res.json(true)
    } else {
      res.json(false)
    }
  })
})

app.post("/createList", (req, res) => {
  list = new List(req.body)
  list.save().then(list=> {
    console.log(list)
    res.json(list)
  }).catch(err => console.log(err))
})

app.get("/getToDoList/:id", (req, res) => {
  // Find one will not return an array (Of one), find one returns one object
  List.findOne({title: req.params.id}, (err, list) => {
    if(!err) {
      res.json(list)
    } else { res.json(false) }
  })
})

app.post("/addItem/:id", (req, res) => {
  List.findOne({title:req.params.id}, (err, list) => {
    list.completed.push(req.body)
    list.save().then(list => {
      console.log(list)
      res.json(list)
    }).catch(err => console.log("Doesn't exist..."))

  })
})

app.post("/updateItem/:id", (req, res) => {
  List.findOne({title: req.params.id}, (err, list) => {
    list.completed[req.body.pos] = req.body.updatedItem
    list.save().then((list) => {
    }).catch((err) => console.log(err) )
  })
})

app.post("/completeItem/:day", (req, res) => {
  List.findOne({title: req.params.day}, (err, list) => {
    list.inCompleted.push(list.completed[req.body.i])
    list.completed.splice(req.body.i, 1)
    list.save().then((l) => {
      res.json('')
    }).catch(err => console.log(err))
  })
})

app.post("/moveItem/:day", (req, res) => {
  List.findOne({title: req.params.day}, (err, list) => {
    let item = list.inCompleted[req.body.i]
    list.completed.push(item)
    list.inCompleted.splice(req.body.i,1)
    list.save().then(list => {
      res.json(list)
    }).catch(err=>console.log(err))
  })
})

app.post("/deleteItem/:day", (req, res) => {
  List.findOne({title:req.params.day}, (err, list) => {
    list.inCompleted.splice(req.body.i)
    list.save().then(list => {
      res.json(list)
    }).catch(err => console.log(err))
  })
})

let catSchema = {
  title: String,
  colour: String
}

let Category = mongoose.model("categories", catSchema)

app.get("/getCategories", (req, res) => {
  Category.find({}, (err, cats) => {
    if(!err) {
      res.json(cats)
    }
  })
})

app.post("/addCategory", (req, res) => {
  category = new Category(req.body)
  category.save().then(cat => {
    res.json(cat)
  }).catch(err=>console.log(err))
})


app.listen(port, () => {
  console.log("Listening on port:", port)
})
