const express = require('express');
const cors = require('cors')
const port = process.env.port || 3000
const mysql = require("mysql")
const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"api_school"
})
//Connexion de l'administrateur
app.post('/',(req,res)=>{
    const sql = "SELECT * FROM admin WHERE code =?"
    const code = req.body.code
    db.query(sql,[code],(err,response)=>{
        if(err){
            return res.status(500).json({message : "Une erreur est survenue !"})
        }
        if(!response || response.length === 0 ){
            return res.status(401).json( {Message : "Le code est incorrecte !"})
        }
        return res.status(200).json({Status: "Success"})
    })
})

//Affichage des étudiants et des notes
app.post("/liste",(req,res)=>{
    const sql = "SELECT * FROM note, etudiant WHERE etudiant.matetud = note.matetud AND etudiant.idclasse = ?"
    const classe = req.body.id
    db.query(sql,[classe],(err,response)=>{
        if(err){
            return res.status(500).json({Message : "Erreur sur le serveur !"})
        }
        if(response.length > 0){
            return res.status(200).json({Status: "Success", data :response})
        }
        return res.status(404).json({Message : "Aucun étudiant trouvé pour cette classe !"})
    })
})

app.post("/note-etudiant",(req,res)=>{
    const sql = "SELECT * FROM note WHERE matetud = ?"
    const matetud = req.body.matetud
    db.query(sql,[matetud],(err,response)=>{
        if(err){
            return res.status(500).json({Message : "Erreur sur le serveur !"})
        }
        if(response.length > 0){
            return res.status(200).json({Status: "Success", data :response})
        }
        return res.status(404).json({Message : "Les notes n'ont pas été trouvé !"})
    })
})
app.get('/liste',(req,res)=>{
    const sql = "SELECT * FROM etudiant"
    db.query(sql,(err,response)=>{
        if(err){
            return res.status(401).json({message: "erreur"})
        }
        return res.status(200).json({data: response})
    })
})

app.listen(port,()=>{
    console.log("Listening... !")
    
})