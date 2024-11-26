const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));


// Connection to the DB
console.log(process.env.DB_CONNECT);  // Check if the string is correctly imported
mongoose.connect(process.env.DB_CONNECT, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,  // This option ensures that the connection uses the new server discovery and monitoring engine.
}).then(() => {
  console.log("Connected to db!");
  app.listen(3001, () => console.log("Server Up and running"));
}).catch(err => {
  console.error("Error connecting to the database:", err);
});


app.set("view engine", "ejs");


// GET METHOD
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find();
    res.render("todo.ejs", {
      todoTasks: tasks  // Pass tasks as todoTasks to the view
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");  // If there's an error, respond with status 500
  }
});


//UPDATE
app.route("/edit/:id")
.get(async (req, res) => {
    const id = req.params.id;
    try{
        const tasks = await TodoTask.find();
        if(res.status(200)) {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        }
    }
    catch(err) {
        throw err;
    }
})
.post(async (req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, {content: req.body.content}) 
        .then((doc, err) => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
});

//POST METHOD
app.post('/',async (req, res) => {
const todoTask = new TodoTask({
content: req.body.content
});
try {
await todoTask.save();
res.redirect("/");
} catch (err) {
res.redirect("/");
}
});


//Delete
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndDelete(id)
      .then(doc=> {
          res.redirect("/");
      }).catch(err => {
          res.send(500, err);
      });
})

