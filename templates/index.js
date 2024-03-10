const express=require("express");
const app=express();
const path=require("path");
const {MongoClient}=require("mongodb");
const { json } = require("body-parser");
const url="mongodb://0.0.0.0:27017"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbspath=path.join(__dirname);
app.set("view engine","hbs");
app.set("views",hbspath)

let visitors=0;


app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db("paramshah");
        const collection = db.collection("paramdata");

        const data = await collection.findOne({ email: req.body.useremail });
        let farhan = data.visitingtime;

        if (data && data.password === req.body.userpassword) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 
            const currentDay = currentDate.getDate();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
            const currentSecond = currentDate.getSeconds();
            const padZero = (num) => (num < 10 ? `0${num}` : num); 

            const dateTimeString = `${currentYear}${padZero(currentMonth)}${padZero(currentDay)} ${padZero(currentHour)}:${padZero(currentMinute)}:${padZero(currentSecond)}`;



            await collection.updateOne(
                { email: req.body.useremail }, 
                {
                    $set: { 
                        lastvisit: dateTimeString,
                        visitingtime: farhan + 1
                    }
                }
            );
            res.render("home");
        } else {
            console.log("Incorrect password");
            res.end("Incorrect password");
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        res.status(500).end("An error occurred during login");
    } finally {
        console.log("done")
    }
});
app.get("/",(req,res)=>{
    try {
        visitors=visitors+1
    console.log(visitors)
    res.end("welcome to my webdite")
    } catch (error) {
        console.log(error)
    }
    
})

app.listen(3000)