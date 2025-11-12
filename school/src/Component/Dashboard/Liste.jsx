import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const Liste = () => {
    const navigate = useNavigate();
    const classe = [
        {
            id: "0",
            title: ".....",
        },
        {
            id: "1",
            title: "6ieme",
        },
        {
            id: "2",
            title: "5ieme",
        },
        {
            id: "3",
            title: "4ieme",
        },
        {
            id: "4",
            title: "3ieme",
        },
        {
            id: "5",
            title: "2nde",
        },
        {
            id: "6",
            title: "1ere",
        },
        {
            id: "7",
            title: "Terminal",
        },
    ];
    const [reqIdClasse, setReqIdClasse] = useState("");
    const [liste, setListe] = useState([]);
    const handleSubmit = (e) => {
        const id = e.target.value;
        setReqIdClasse({ id });
        setListe([]);
    };
    useEffect(() => {
        if (reqIdClasse.id !== "") {
            axios
                .post("http://localhost:3000/liste", reqIdClasse)
                .then((res) => {
                    if (res.data.Status === "Success") {
                        setListe(res.data.data);
                        console.log("✅ Données récupérées !");
                        setReqIdClasse("");
                    } else {
                        setListe([]);
                        alert("Aucun étudiant trouvé !");
                    }
                })
                .catch((error) => {
                    console.error("Erreur Axios:", error);
                });

            // Récupérer le pourcentage de réussite
            axios
                .post("http://localhost:3000/pourcentage-reussite", reqIdClasse)
                .then((res) => {
                    if (res.data.Status === "Success") {
                        setPourcentageReussite(res.data.pourcentage);
                    }
                })
                .catch((error) => {
                    console.error("Erreur pourcentage:", error);
                });
        }
    }, [reqIdClasse]);
    // État pour gérer le tri (A-Z / Z-A)
    // eslint-disable-next-line no-unused-vars
    const [sortOrder, setSortOrder] = useState(""); // "asc", "desc", ou ""

    // État pour le pourcentage de réussite
    const [pourcentageReussite, setPourcentageReussite] = useState(0);
    //Affichage des notes de l'étudiant unique
    const [matricule, setMatricule] = useState("");
    const [note, setNote] = useState([]);
    const handleNote = (e) => {
        const matetud = e.target.value;
        // stocker uniquement la valeur (string) et réinitialiser les notes
        setMatricule(matetud);
        setNote([]);
    };
    useEffect(() => {
        if (matricule !== "") {
            // envoyer un objet { matetud } attendu par le backend
            axios
                .post("http://localhost:3000/note-etudiant", { matetud: matricule })
                .then((res) => {
                    if (res.data.Status === "Success") {
                        setNote(res.data.data);
                    } else {
                        setNote([]);
                        alert("Aucun note trouvé pour cet étudiant !");
                    }
                })
                .catch((error) => console.log(error));
        }
    }, [matricule]);

    // Fonction pour supprimer un étudiant avec confirmation
    const handleDeleteStudent = (matetud) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet étudiant et toutes ses données ?"
            )
        ) {
            axios
                .post(`http://localhost:3000/supprimer/${matetud}`, {
                    matetud: matetud,
                })
                // eslint-disable-next-line no-unused-vars
                .then((res) => {
                    alert("L'étudiant a été supprimé avec succès !");
                    // Rafraîchir la liste en réinitialisant
                    setReqIdClasse(reqIdClasse);
                    setMatricule("");
                    setNote([]);
                    navigate("/liste");
                })
                .catch((error) => {
                    console.error("Erreur lors de la suppression :", error);
                    alert("Erreur lors de la suppression de l'étudiant");
                });
        }
    };

    // Fonction pour trier les étudiants par nom + prénom
    const sortStudents = (order) => {
        const sorted = [...liste];
        if (order === "asc") {
            sorted.sort((a, b) => {
                const nameA = (a.nometud + a.prenetud).toLowerCase();
                const nameB = (b.nometud + b.prenetud).toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (order === "desc") {
            sorted.sort((a, b) => {
                const nameA = (a.nometud + a.prenetud).toLowerCase();
                const nameB = (b.nometud + b.prenetud).toLowerCase();
                return nameB.localeCompare(nameA);
            });
        }
        setSortOrder(order);
        setListe(sorted);
    };
    //Total est étudiant
    const [nbetudiant, setNbEtudiant] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/liste")
            .then((res) => {
                if (res.data.Status === "Success") {
                    setNbEtudiant(res.data.count); // ← Récupère le nombre total directement
                }
            })
            .catch((error) => console.log(error));
    }, []); // ← Exécuté une seule fois au chargement du composant
    console.log(liste);
    return (
        <div className="   py-30 bg-[#dee2e6] relative min-h-screen flex ">
            <Navbar />
            <div className="  ml-100   p-10  min-h-[90vh] bg-white rounded-3xl min-w-7xl">
                <div className="max-w-7xl mx-auto  p-10">
                    <div>
                        <h1 className="text-5xl font-bold">Tableau de bord</h1>
                    </div>
                    <div className=" flex items-center justify-around  my-15 ">
                        <div className="p-10  rounded-2xl shadown">
                            <h3 className="text-lg font-semibold mb-2">
                                Nombre total d'étudiant
                            </h3>
                            <p className="text-4xl font-bold text-blue-600">{nbetudiant}</p>
                        </div>
                        <div className="p-10  rounded-2xl shadown">
                            <h3 className="text-lg font-semibold mb-2">
                                Effectif par classe
                            </h3>
                            <p className="text-4xl font-bold text-green-600">
                                {liste.length}
                            </p>
                        </div>
                        <div className="p-10  rounded-2xl shadown">
                            <h3 className="text-lg font-semibold mb-2">
                                Pourcentage de réussite
                            </h3>
                            <p
                                className={`text-4xl font-bold ${pourcentageReussite >= 70
                                        ? "text-green-600"
                                        : pourcentageReussite >= 50
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                            >
                                {pourcentageReussite}%
                            </p>
                        </div>
                    </div>
                    <div className=" mt-15 w-full p-5 border flex items-center justify-around rounded-full ">
                        <div className="flex items-center gap-1.5">
                            <h3>Classe</h3>
                            <select
                                name="classe"
                                id="classe"
                                onChange={handleSubmit}
                                value={classe.id}
                            >
                                {classe.map((classes) => (
                                    <option value={classes.id} key={classes.id}>
                                        {" "}
                                        {classes.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <h3>Etudiants</h3>
                            <select onChange={handleNote} name="matetud" id="matetud">
                                <option value="">...</option>
                                {liste.map((etudiant) => (
                                    <option value={etudiant.matetud} key={etudiant.matetud}>
                                        {" "}
                                        {etudiant.nometud} {etudiant.prenetud}{" "}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => sortStudents("asc")}
                            className=" p-2 hover:text-gray-500 transition-all duration-150 cursor-pointer rounded-2xl"
                        >
                            A-Z
                        </button>
                        <button
                            onClick={() => sortStudents("desc")}
                            className=" p-2 hover:text-gray-500 transition-all duration-150 cursor-pointer rounded-2xl"
                        >
                            Z-A
                        </button>
                    </div>
                    <div className="  p-5">
                        <table
                            cellSpacing={20}
                            className=" table-auto border-collapse w-full "
                        >
                            <thead className=" bg-gray-200 px-5 text-center ">
                                <tr className="text-left ">
                                    <th className="   p-4 ">Matricule</th>
                                    <th className="   p-4 ">Nom</th>
                                    <th className="   p-4 ">Prénom</th>
                                    <th className="   p-4 ">Date de naissance</th>
                                    <th className="   p-4 ">Sexe</th>
                                    <th className="   p-4 ">Moyenne Générale</th>
                                    <th className="   p-4 ">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {liste.map((etud) => (
                                    <tr className=" border-b">
                                        <td className="p-3"> {etud.matetud} </td>
                                        <td className="p-3"> {etud.nometud} </td>
                                        <td className="p-3"> {etud.prenetud} </td>
                                        <td className="p-3"> {etud.datenaiss} </td>
                                        <td className="p-3"> {etud.sexeetud} </td>
                                        <td className="p-3"> {etud.moyenne} </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <button className=" p-3 bg-green-500 text-white font-medium rounded cursor-pointer duration-200 hover:bg-green-600 ">
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(etud.matetud)}
                                                    className=" p-3 bg-red-500 text-white font-medium rounded cursor-pointer duration-200 hover:bg-red-600 "
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-5 my-30">
                        <table className="table-fixed border-collapse w-full ">
                            <thead className="bg-gray-200 text-center">
                                <tr>
                                    <th className="p-3">IDNOTE</th>
                                    <th className="p-3">Matricule étudiant</th>
                                    <th className="p-3">
                                        Français
                                        <br />
                                        <span className="text-xs font-normal">(DS / DE)</span>
                                    </th>
                                    <th className="p-3">
                                        Mathématique
                                        <br />
                                        <span className="text-xs font-normal">(DS / DE)</span>
                                    </th>
                                    <th className="p-3">
                                        Anglais
                                        <br />
                                        <span className="text-xs font-normal">(DS / DE)</span>
                                    </th>
                                    <th className="p-3">
                                        SVT
                                        <br />
                                        <span className="text-xs font-normal">(DS / DE)</span>
                                    </th>
                                    <th className="p-3">Moy.</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {note.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center text-gray-500">
                                            Sélectionnez un étudiant pour voir ses notes
                                        </td>
                                    </tr>
                                ) : (
                                    note.map((notes) => (
                                        <tr
                                            key={notes.idnote}
                                            className="text-sm text-center border-b"
                                        >
                                            <td className="p-3 whitespace-nowrap">{notes.idnote}</td>
                                            <td className="p-3 text-left whitespace-nowrap">
                                                {notes.matetud}{" "}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="">{notes.DSFR ?? "-"}</span>
                                                    <span className="">{notes.DEFR ?? "-"}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="">{notes.DSMATH ?? "-"}</span>
                                                    <span className="">{notes.DEMATH ?? "-"}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="">{notes.DSANG ?? "-"}</span>
                                                    <span className="">{notes.DEANG ?? "-"}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="">{notes.DSSVT ?? "-"}</span>
                                                    <span className="">{notes.DESVT ?? "-"}</span>
                                                </div>
                                            </td>
                                            <td className="">
                                                <div className=" mx-auto truncate text-center">
                                                    {notes.moyenne ?? "-"}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <button className="p-2 w-25 bg-green-500 text-white rounded cursor-pointer duration-200 transition-colors hover:bg-green-600 ">
                                                        Modifier
                                                    </button>
                                                    <button className="p-2 w-25 bg-red-500 text-white rounded cursor-pointer duration-200 transition-colors hover:bg-red-600 ">
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Liste;
