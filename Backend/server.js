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

app.listen(port, () => {
  console.log("Listening on port:", port)
})
