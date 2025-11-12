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
    const sql = "SELECT etudiant.*, note.* FROM etudiant LEFT JOIN note ON etudiant.matetud = note.matetud WHERE etudiant.idclasse = ?"
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

// Route pour calculer le pourcentage de réussite par classe
app.post("/pourcentage-reussite",(req,res)=>{
    const classe = req.body.id
    // Supposons qu'une moyenne >= 10 est considérée comme "réussite"
    const sql = "SELECT COUNT(DISTINCT etudiant.matetud) as total, COUNT(DISTINCT CASE WHEN (COALESCE(note.DSFR, 0) + COALESCE(note.DEFR, 0)) / 2 >= 10 THEN etudiant.matetud END) as reussis FROM etudiant LEFT JOIN note ON etudiant.matetud = note.matetud WHERE etudiant.idclasse = ?"
    
    db.query(sql,[classe],(err,response)=>{
        if(err){
            return res.status(500).json({Message : "Erreur sur le serveur !"})
        }
        const total = response[0].total
        const reussis = response[0].reussis || 0
        const pourcentage = total > 0 ? Math.round((reussis / total) * 100) : 0
        
        return res.status(200).json({Status: "Success", pourcentage: pourcentage, reussis: reussis, total: total})
    })
})
// app.get('/liste',(req,res)=>{
//     const sql = "SELECT * FROM etudiant"
//     db.query(sql,(err,response)=>{
//         if(err){
//             return res.status(401).json({message: "erreur"})
//         }
//         return res.status(200).json({data: response})
//     })
// })
// Supprimer un étudiant 
app.post('/supprimer/:matetud',(req,res)=>{
    const id = req.params.matetud
    const sql ="DELETE  FROM etudiant WHERE matetud=?"
    db.query(sql,[id],(err,response)=>{
        if(err){
            return res.status(401).json({message: "erreur"})
        }
        return res.status(200).json({message: "l'étudiant ainsi que ses données ont bien été supprimé"})
    })
})
//liste de tout les étudiants 
app.get('/liste',(req,res)=>{
    const sql = "SELECT COUNT(*) as total FROM etudiant"
    db.query(sql,(err,response)=>{
        if(err){
            return res.status(500).json({message: "Erreur serveur"})
        }
        const count = response[0].total
        return res.status(200).json({Status: "Success", count: count})
    })
})

app.listen(port,()=>{
    console.log("Listening... !")
    
})