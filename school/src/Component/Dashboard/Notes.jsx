import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import axios from "axios";

const Notes = () => {
    const [etudiant, setEtudiant] = useState([]);
    const [matclasse, setMatClasse] = useState('');
    const [notes, setNotes] = useState({
        matetud: "",
        DSFR: "", DEFR: "", MFR: "",
        DSMATH: "", DEMATH: "", MMATH: "",
        DSANG: "", DEANG: "", MANG: "",
        DSSVT: "", DESVT: "", MSVT: "",
        moyenne: ""
    });

    // Liste des classes
    const classe = [
        { id: "1", title: "6ieme" },
        { id: "2", title: "5ieme" },
        { id: "3", title: "4ieme" },
        { id: "4", title: "3ieme" },
        { id: "5", title: "2nde" },
        { id: "6", title: "1iere" },
        { id: "7", title: "terminal" },
    ];

    // Liste des matières
    const matieres = [
        { title: "Français", coefficient: 3, dsKey: "DSFR", deKey: "DEFR", moyKey: "MFR" },
        { title: "Mathématique", coefficient: 4, dsKey: "DSMATH", deKey: "DEMATH", moyKey: "MMATH" },
        { title: "Anglais", coefficient: 2, dsKey: "DSANG", deKey: "DEANG", moyKey: "MANG" },
        { title: "SVT", coefficient: 4, dsKey: "DSSVT", deKey: "DESVT", moyKey: "MSVT" }
    ];

    // ✅ Récupération des étudiants selon la classe
    useEffect(() => {
        if (matclasse !== '') {
            axios.post('http://localhost:3000/note', { idclasse: matclasse })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setEtudiant(res.data.data);
                    } else {
                        alert(res.data.Message);
                        setEtudiant([]);
                    }
                })
                .catch(error => console.error('Erreur POST /note:', error));
        }
    }, [matclasse]);

    // ✅ Calcul moyenne par matière
    const calculerMoyenneMatiere = (ds, de) => {
        const dsNum = parseFloat(ds) || 0;
        const deNum = parseFloat(de) || 0;
        return ((dsNum + (deNum * 2)) / 3).toFixed(2);
    };

    // ✅ Calcul moyenne générale
    const calculerMoyenneGenerale = () => {
        let totalPoints = 0;
        let totalCoeffs = 0;
        
        matieres.forEach(mat => {
            const ds = parseFloat(notes[mat.dsKey]) || 0;
            const de = parseFloat(notes[mat.deKey]) || 0;
            const moyMatiere = (ds + (de * 2)) / 3;
            totalPoints += moyMatiere * mat.coefficient;
            totalCoeffs += mat.coefficient;
        });
        
        return totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : "0.00";
    };

    // ✅ Mettre à jour automatiquement les moyennes
    useEffect(() => {
        const nouvellesNotes = { ...notes };
        
        // Calculer les moyennes par matière
        matieres.forEach(mat => {
            const moy = calculerMoyenneMatiere(notes[mat.dsKey], notes[mat.deKey]);
            nouvellesNotes[mat.moyKey] = moy;
        });
        
        // Calculer la moyenne générale
        nouvellesNotes.moyenne = calculerMoyenneGenerale();
        
        setNotes(nouvellesNotes);
    }, [
        notes.DSFR, notes.DEFR,
        notes.DSMATH, notes.DEMATH,
        notes.DSANG, notes.DEANG,
        notes.DSSVT, notes.DESVT
    ]);

    // ✅ Fonction d'enregistrement
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!notes.matetud) {
            alert("Veuillez sélectionner un étudiant");
            return;
        }

        // Préparer les données pour l'envoi
        const donneesNotes = {
            matetud: notes.matetud,
            DSFR: parseFloat(notes.DSFR) || 0,
            DEFR: parseFloat(notes.DEFR) || 0,
            MFR: parseFloat(notes.MFR) || 0,
            DSMATH: parseFloat(notes.DSMATH) || 0,
            DEMATH: parseFloat(notes.DEMATH) || 0,
            MMATH: parseFloat(notes.MMATH) || 0,
            DSANG: parseFloat(notes.DSANG) || 0,
            DEANG: parseFloat(notes.DEANG) || 0,
            MANG: parseFloat(notes.MANG) || 0,
            DSSVT: parseFloat(notes.DSSVT) || 0,
            DESVT: parseFloat(notes.DESVT) || 0,
            MSVT: parseFloat(notes.MSVT) || 0,
            moyenne: parseFloat(notes.moyenne) || 0
        };

        console.log("Données envoyées:", donneesNotes);

        axios.post("http://localhost:3000/note/enregistrer", donneesNotes)
            .then(res => {
                if (res.data.Status === "Success") {
                    alert("✅ Notes enregistrées avec succès !");
                    // Réinitialiser le formulaire
                    setNotes({
                        matetud: "",
                        DSFR: "", DEFR: "", MFR: "",
                        DSMATH: "", DEMATH: "", MMATH: "",
                        DSANG: "", DEANG: "", MANG: "",
                        DSSVT: "", DESVT: "", MSVT: "",
                        moyenne: ""
                    });
                } else {
                    alert("⚠️ " + res.data.Message);
                }
            })
            .catch(err => {
                console.error("Erreur lors de l'enregistrement :", err);
                alert("❌ Erreur lors de l'enregistrement des notes");
            });
    };

    // ✅ Réinitialiser les notes quand on change d'étudiant
    useEffect(() => {
        if (notes.matetud) {
            setNotes(prev => ({
                ...prev,
                DSFR: "", DEFR: "", 
                DSMATH: "", DEMATH: "", 
                DSANG: "", DEANG: "", 
                DSSVT: "", DESVT: "", 
                MFR: "", MMATH: "", MANG: "", MSVT: "",
                moyenne: ""
            }));
        }
    }, [notes.matetud]);

    return (
        <div className="py-30 bg-[#dee2e6] relative min-h-screen flex">
            <Navbar />
            <div className="ml-100 p-10 min-h-[90vh] bg-white rounded-3xl min-w-7xl">
                <h1 className="text-5xl font-bold mb-10">Enregistrement des notes</h1>

                {/* Sélection de la classe et de l'étudiant */}
                <div className="flex gap-10 mb-10">
                    <div className="flex flex-col w-1/3">
                        <label className="text-xl font-bold">Classe</label>
                        <select 
                            onChange={(e) => setMatClasse(e.target.value)} 
                            value={matclasse}
                            className="px-8 py-4 border rounded"
                        >
                            <option value="">Sélectionnez</option>
                            {classe.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col w-1/3">
                        <label className="text-xl font-bold">Nom & Prénoms</label>
                        <select
                            onChange={(e) => setNotes({ ...notes, matetud: e.target.value })}
                            value={notes.matetud}
                            className="px-8 py-4 border rounded"
                        >
                            <option value="">Sélectionnez un étudiant</option>
                            {etudiant.map((etud) => (
                                <option key={etud.matetud} value={etud.matetud}>
                                    {etud.nometud} {etud.prenetud}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Formulaire des matières */}
                <form className="px-20" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-12">
                        {matieres.map((mat) => (
                            <div key={mat.title} className="flex flex-col">
                                <h3 className="font-bold text-2xl mb-3">{mat.title}</h3>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-medium">DS</p>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.5"
                                            onChange={(e) => setNotes({ ...notes, [mat.dsKey]: e.target.value })}
                                            value={notes[mat.dsKey]}
                                            className="px-4 py-2 w-20 border-b bg-gray-100 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-medium">DE</p>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.5"
                                            onChange={(e) => setNotes({ ...notes, [mat.deKey]: e.target.value })}
                                            value={notes[mat.deKey]}
                                            className="px-4 py-2 w-20 border-b bg-gray-100 outline-none"
                                        />
                                        <p className="text-sm text-gray-600">x2</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-medium">Coeff</p>
                                        <input
                                            type="text"
                                            value={mat.coefficient}
                                            className="px-4 py-2 w-10 outline-none bg-gray-50 text-center"
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-medium">Moyenne</p>
                                        <input
                                            type="text"
                                            value={notes[mat.moyKey] || "0.00"}
                                            className="px-4 py-2 w-20 border-b bg-blue-100 outline-none text-center font-medium"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Moyenne générale */}
                    <div className="flex items-center gap-4 px-10 my-10 p-4 bg-gray-100 rounded">
                        <p className="text-xl font-bold">Moyenne Générale</p>
                        <input
                            type="text"
                            value={notes.moyenne || "0.00"}
                            className="border-b bg-green-200 rounded px-3 py-2 outline-none w-24 font-bold text-lg text-center"
                            readOnly
                        />
                    </div>

                    {/* Bouton enregistrer */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className="w-1/4 px-10 py-4 rounded font-bold text-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
                            disabled={!notes.matetud}
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Notes;