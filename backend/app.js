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
    const sql = "SELECT DISTINCT etudiant.matetud, etudiant.nometud, etudiant.prenetud, etudiant.datenaiss, etudiant.sexeetud, etudiant.idclasse FROM etudiant WHERE etudiant.idclasse = ?"
    const classe = req.body.id
    console.log('POST /liste reçu avec idclasse:', classe)
    
    db.query(sql,[classe],(err,response)=>{
        if(err){
            console.error('Erreur SQL /liste:', err)
            return res.status(500).json({Message : "Erreur sur le serveur !"})
        }
        console.log('Réponse SQL /liste:', response.length, 'lignes')
        
        // Toujours retourner 200 avec une liste (vide ou complète)
        if(response.length > 0){
            return res.status(200).json({Status: "Success", data: response})
        }
        return res.status(200).json({Status: "Success", data: []})
    })
})
// Selection des notes par etudiants
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
//Ajout des etudiants
//Récuperation des classes
app.get('/register',(req,res)=>{
    const sql = "SELECT idclasse,nomclasse FROM classe "
    db.query(sql,(err,response)=>{
        if(err){
            return res.status(500).json({message: "Erreur serveur"})
        }
        if(response.length > 0){
        return res.status(200).json({Status: "Success", data: response})
        }
    })
})
app.post('/register', (req, res) => {
    
        const { matetud, nometud, prenetud, datenaiss, sexeetud, idclasse } = req.body
        
        // Validation des champs requis

        // Validation du format du matricule (optionnel)

        const sql = "INSERT INTO etudiant (matetud, nometud, prenetud, datenaiss, sexeetud, idclasse) VALUES (?, ?, ?, ?, ?, ?)"
        const values = [matetud, nometud, prenetud, datenaiss, sexeetud, idclasse]

        db.query(sql, values, (err, response) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ 
                        Status: 'Error',
                        Message: 'Le matricule existe déjà' 
                    })
                }
                console.error('Erreur SQL /register :', err)
                return res.status(500).json({ 
                    Status: 'Error',
                    Message: 'Erreur serveur lors de l\'insertion' 
                })
            }
            
            return res.status(201).json({ 
                Status: 'Success', 
                Message: 'Étudiant ajouté avec succès',
                Data: {
                    id: response.insertId,
                    matricule: matetud
                }
            })
        })
        
})
//Ajout des etudiants

//affichage des classes dans note
app.post('/note',(req,res)=>{
    const sql = "SELECT matetud, nometud, prenetud FROM etudiant WHERE idclasse = ?"
    const idclasse = req.body.idclasse
    db.query(sql,[idclasse],(err,response)=>{
        if(err){
            console.error('Erreur SQL /note:', err)
            return res.status(500).json({Status: 'Error', Message: 'Erreur serveur', Error: err.message})
        }
        
        // Corriger la condition : response.length au lieu de response
        if(response.length > 0){
            return res.status(200).json({Status: 'Success', Message: "Etudiants trouvés", data: response})
        }
        // Retourner liste vide en succès
        return res.status(200).json({Status: 'Success', Message: 'Aucun étudiant', data: []})
    })
})

//Insertion des notes
app.post('/note/enregistrer',(req,res)=>{
    const {matetud,DSFR,DEFR,MFR,DSMATH,DEMATH,MMATH,DSANG,DEANG,MANG,DSSVT, DESVT,MSVT,moyenne} = req.body
    console.log("Donnee recu",req.body)
    const sql = "INSERT INTO note(matetud,DSFR,DEFR,MFR,DSMATH,DEMATH,MMATH,DSANG,DEANG,MANG,DSSVT,DESVT,MSVT,moyenne)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    const values = [matetud,DSFR,   DEFR,MFR, DSMATH,DEMATH,MMATH,DSANG,DEANG,MANG,DSSVT,DESVT,MSVT,moyenne]
    db.query(sql,values,(err,response)=>{
        if(err){
            console.error('Erreur SQL /note:', err)
            return res.status(500).json({Status: 'Error', Message: 'Erreur serveur', Error: err.message})
        }
        return res.status(200).json({Status: 'Success', Message: "Note enregistrée"})
    })
})





app.listen(port,()=>{
    console.log("Listening... !")
    
})