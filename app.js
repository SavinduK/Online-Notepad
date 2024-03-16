//import libraries
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const port = process.env.port || 3000

//dev
app.use(express.static('public'))

const dbPath = './database.json'
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set('view engine','ejs')


//view login page
app.get('/',(req,res)=>{
    res.render('login')
})

//handle login
app.post('/',(req,res)=>{
    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        username = req.body.username
        data = JSON.parse(data)

        for (var key in data){
            if(data.hasOwnProperty(key)){
                console.log(key)
                if(username == key)           res.redirect(`/home/${username}`)
                    return
                }}
        }
        data[`${username}`] = []
        console.log(data)
        fs.writeFile(dbPath, JSON.stringify(data),'utf-8', (err) => {
            if (err) {
              throw err;
            }
            res.redirect(`/home/${username}`)
             })   
        })      
})

//view homepage
app.get("/home/:username",(req,res)=>{
    let username = req.params.username
    res.render('home',{username}) 
})

//add new note(webpage) 
app.get("/add/:username",(req,res)=>{
    let username = req.params.username
    res.render('addNote',{username}) 
})

//add new note to database
app.post("/add/:username",(req,res)=>{
    let username = req.params.username
    let title = req.body.title
    let text = req.body.text

    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        data = JSON.parse(data)
        data[username].push([title,text])
        fs.writeFile(dbPath, JSON.stringify(data),'utf-8', (err) => {
            if (err) {
              throw err;
            }
            res.redirect(`/home/${username}`)
             })   
    })
})

//send notes to frontend
app.get("/get-data/:username",(req,res)=>{
    let username = req.params.username
    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        data = JSON.parse(data) 
        res.json(data[`${username}`])
        })      

})
//delete note
app.get("/delete/:username/:id",(req,res)=>{
    let username = req.params.username
    let id = req.params.id
    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        data = JSON.parse(data) 
        data[`${username}`].splice(id,1)
        fs.writeFile(dbPath, JSON.stringify(data),'utf-8', (err) => {
            if (err) {
              throw err;
            }
            res.redirect(`/home/${username}`)
             }) 
        })  
})
//edit note view
app.get("/note/:username/:id",(req,res)=>{
    let username = req.params.username
    let id = req.params.id
    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        data = JSON.parse(data) 
        note = data[`${username}`][`${id}`]
        res.render('editNote',{username,id}) 
        })    
})

//edit note database
app.post("/note/:username/:id",(req,res)=>{
    let username = req.params.username
    let id = req.params.id
    let title = req.body.title
    let text = req.body.text
    fs.readFile(dbPath,'utf-8',(err,data)=>{
        if (err) {
            throw err
          }
        data = JSON.parse(data) 
        data[`${username}`][`${id}`][0] = title
        data[`${username}`][`${id}`][1] = text

        fs.writeFile(dbPath, JSON.stringify(data),'utf-8', (err) => {
            if (err) {
              throw err;
            }
            res.redirect(`/home/${username}`)
             }) 
        })    
})

//run server on port 3000
app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})