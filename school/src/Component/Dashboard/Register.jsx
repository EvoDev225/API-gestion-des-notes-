import { useState, useEffect } from "react";
import axios from "axios";
// import { IoMdMale } from "react-icons/io";
import Navbar from "../Navbar";

const Register = () => {
    const [listeClasse, setListeClasse] = useState([])
    const [matricule, setMatricule] = useState("")
    const [etudiant,setEtudiant]= useState({
        matetud: "",
        nometud:"",
        prenetud:"",
        datenaiss:"",
        sexeetud:"",
        idclasse:"",
    })
    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('http://localhost:3000/register',etudiant)
        .then(res=>{
            if(res.data.Status==="Success"){
                console.log(res.data.Message)
                alert("Étudiant enregistré avec succès !")
                // Vider le formulaire
                setEtudiant({
                    matetud: "",
                    nometud:"",
                    prenetud:"",
                    datenaiss:"",
                    sexeetud:"",
                    idclasse:"",
                })
                // Regénérer le matricule pour le prochain enregistrement
                genererMatricule()
            }
            else{
                alert("Les données n'ont pas été inséré !")
            }
        })
        .catch(error=>console.log(error))
    }
    // Générateur de matricule: récupère le nombre d'étudiants et crée ET###
    const genererMatricule = async () => {
        try {
            const res = await axios.get("http://localhost:3000/liste")
            if (res.status === 200 && res.data && typeof res.data.count !== 'undefined') {
                const next = Number(res.data.count) + 1
                const num = String(next).padStart(3, '0')
                const m = `ET${num}`
                setMatricule(m)
                setEtudiant(prev => ({ ...prev, matetud: m }))
            } else {
                // si la route ne renvoie pas le count attendu, on initialise à ET001
                setMatricule('ET001')
                setEtudiant(prev => ({ ...prev, matetud: 'ET001' }))
            }
        } catch (error) {
            console.error('Erreur lors de la génération du matricule :', error)
            setMatricule('ET001')
            setEtudiant(prev => ({ ...prev, matetud: 'ET001' }))
        }
    }

    useEffect(() => {
        axios.get("http://localhost:3000/register")
            .then(res => {
                if (res.data.Status === "Success") {
                    setListeClasse(res.data.data)  // ← Ne pas mettre entre crochets, c'est déjà un array
                    // Après avoir récupéré les classes, générer le matricule
                    genererMatricule()
                } else {
                    alert('Une erreur est survenue !')
                }
            })
            .catch(error => console.log(error))
    }, [])  // ← Dépendances vides = exécuté une seule fois au montage
    return (
        <div className="   py-30 bg-[#dee2e6] relative min-h-screen flex ">
            <Navbar />
            <div className="  ml-100   p-10  min-h-[90vh] bg-white rounded-3xl min-w-7xl">
            <div>
                <h1 className="text-5xl font-bold">Enregistrement des étudiants</h1>
            </div>
            <div className="my-30  ">
                <form onSubmit={handleSubmit} action="" className="max-w-5xl mx-auto  px-15 py-10 bg-gray-100">
                    <div className=" flex items-center my-10 gap-2  w-full">
                            <div className="flex flex-col gap-2 w-1/2">
                                <label htmlFor="matricule" className="text-xl font-bold">Matricule</label>
                                <input type="text" id="matricule" value={matricule} name="matricule" className="px-8 py-4 border-b shadow focus:outline-none " readOnly />
                            </div>
                    </div>
                    <div className=" flex items-center gap-2  w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="nom" className="text-xl font-bold">Nom</label>
                            <input type="text" name="nometud" id="nom" value={etudiant.nometud} onChange={e=>setEtudiant({...etudiant,nometud: e.target.value})}  className="px-8 py-4 border-b shadow focus:outline-none "   />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="prenom" className="text-xl font-bold">Prénom</label>
                            <input type="text" name="prenetud" id="prennom" value={etudiant.prenetud} onChange={e=>setEtudiant({...etudiant,prenetud: e.target.value})}  className="px-8 py-4 border-b shadow focus:outline-none "   />
                        </div>
                    </div>
                    <div className=" flex items-center gap-2 my-10  w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="date" className="text-xl font-bold">Date de naissance</label>
                            <input type="date" id="date" value={etudiant.datenaiss} onChange={e=>setEtudiant({...etudiant,datenaiss: e.target.value})} name="datenaiss" className="px-8 py-4 border-b shadow focus:outline-none "   />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="sexe" className="text-xl font-bold">Sexe</label>
                            <select name="sexeetud" id="sexeetud" value={etudiant.sexeetud} onChange={e=>setEtudiant({...etudiant,sexeetud: e.target.value})}  className="px-8 py-4 focus:outline-none border-b">
                                <option value="">Sélectionnez</option>
                                <option value="masculin">Masculin</option>
                                <option value="feminin">Féminin</option>
                            </select>
                        </div>
                    </div>
                    <div className=" flex items-center gap-2 my-10  w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="classe" className="text-xl font-bold">Classe</label>
                            <select name="idclasse" id="classe" value={etudiant.idclasse} onChange={e=>setEtudiant({...etudiant,idclasse: e.target.value})}  className=" shadow px-8 py-4 focus:outline-none border-b">
                                <option value="">Sélectionnez une classe</option>
                                {listeClasse.map((classe) => (
                                    <option value={classe.idclasse} key={classe.idclasse}>
                                        {classe.nomclasse}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button type="submit" className=" shadow px-20 py-5  bg-blue-400 text-white font-bold rounded cursor-pointer">Enregistrer</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
};
export default Register;
