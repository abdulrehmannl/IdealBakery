const express = require("express");
const fs = require("fs")
// import data
const users = require('./MOCK_DATA.json')   // ./ = current directory , // users refers to our users added data
// create app
const app = express();
// add port
const PORT = 8000;
// Middleware - plugin
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//Routes using SSR HTML
// Demoo on how HTML render looks like
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</ul>`).join("")}
    </ul>`;
    res.send(html)
})

// Define Routes using CSR for web and mobile
app.get("/api/users", (req, res) => {
    return res.json(users);
})

// dynamically fetching the id
// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);   // id was a string so we converted it to Number
//     // find
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })

// POST
app.post("/api/users", (req, res) => {
    // TODO: Creatte new user
    const body = req.body;   // it will add the data that we added on the frontend side
   // console.log('Body', body)
   users.push({...body, id: users.length + 1})  // but must add on the file using fs
   fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) =>{
    if (error) {
      return res.status(500).json({status: "Error"});
   }
   return res.json({status: "Success", id: users.length}); // don't include + 1 here , cause we are already pushing it.
   })
    
});

// PATCH
// app.patch("/api/users/:id", (req, res) => {
//     // TODO: Edit the user with id
//     return res.json({status: "pending"});
// });


// delete
// app.delete("/api/users/:id", (req, res) => {
//     // TODO: delete the user with id
//     return res.json({status: "pending"});
// });

// noow instead of all seperate, we can merge them as well. ehere "/api/users/:id" is same
// get, patch, delete.
// all in one at once for "/api/users/:id"
app
   .route("/api/users/:id")
   .get((req, res) => {
    const id = Number(req.params.id);   // id was a string so we converted it to Number
    // find
    const user = users.find((user) => user.id === id);
    return res.json(user); })
    .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...body };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error) => {
        if (error) {
            return res.status(500).json({ status: "Error updating user" });
        }
        return res.json({ status: "User updated" });
    });
})
    .delete((req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    users.splice(userIndex, 1);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error) => {
        if (error) {
            return res.status(500).json({ status: "Error deleting user" });
        }
        return res.json({ status: "User deleted" });
    });
});



// Listen o the PORT
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
// Now go and start the script in package.jsson file (Replace "test": "..." -> "start": "node index.js")