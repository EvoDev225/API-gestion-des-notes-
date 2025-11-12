import { FaUser } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const Affichage = () => {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Utilisation de useEffect avec async/await
  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Récupération des données pour l'étudiant:", id);
        
        // ✅ Utilisation de async/await
        const response = await axios.get(`http://localhost:3000/affichage/${id}`);
        
        console.log("Données reçues:", response.data);
        
        if (response.data.Status === "Success") {
          setEtudiant(response.data.data[0]);
        } else {
          setError("Les données de l'étudiant sont vides !");
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Erreur lors du chargement des données de l'étudiant");
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiant();
  }, [id]); // ✅ Dépendance sur id

  // ✅ États de chargement et d'erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full p-20">
        <div className="text-xl">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full p-20">
        <div className="text-xl text-red-500">
          {error}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ✅ Vérification que etudiant n'est pas null
  if (!etudiant) {
    return (
      <div className="flex items-center justify-center w-full p-20">
        <div className="text-xl">Aucune donnée trouvée pour cet étudiant</div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full p-20">
      <div className="min-w-7xl mx-auto  bg-gray-200 px-20 py-10 rounded-3xl">
        {/* Section Informations Personnelles */}
        <div className=" flex items-center justify-around gap-20 w-full">
          <div className="text-6xl">
            <FaUser />
          </div>
          <div className="px-10 py-5">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Matricule:</h3>
              <p className="text-md">{etudiant.matetud}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Nom:</h3>
              <p className="text-md">{etudiant.nometud}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Prénom:</h3>
              <p className="text-md">{etudiant.prenetud}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Date de naissance:</h3>
              <p className="text-md">
                {new Date(etudiant.datenaiss).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Sexe:</h3>
              <p className="text-md">{etudiant.sexeetud}</p>
            </div>
          </div>
        </div>

        {/* Section Notes */}
        <div className="my-10">
          <table className="w-full p-20 rounded-2xl">
            <thead className="border-3 rounded">
              <tr>
                <th className="text-2xl font-bold">Matière</th>
                <th className="text-2xl font-bold">Devoir Surveillé</th>
                <th className="text-2xl font-bold">Devoir Examen</th>
                <th className="text-2xl font-bold">Moyenne</th>
              </tr>
            </thead>
            <tbody className="border-2 bg-white">
              <tr>
                <td className="text-start">
                  <div className="flex flex-col border-2 gap-5">
                    <h3 className="border-b text-xl font-semibold">Français</h3>
                    <h3 className="border-b text-xl font-semibold">Mathématique</h3>
                    <h3 className="border-b text-xl font-semibold">Anglais</h3>
                    <h3 className="border-b text-xl font-semibold">SVT</h3>
                  </div>
                </td>
                <td className="text-start">
                  <div className="flex flex-col gap-5 border-2">
                    <p className="border-b text-xl">{etudiant.DSFR}</p>
                    <p className="border-b text-xl">{etudiant.DSMATH}</p>
                    <p className="border-b text-xl">{etudiant.DSANG}</p>
                    <p className="border-b text-xl">{etudiant.DSSVT}</p>
                  </div>
                </td>
                <td className="text-start">
                  <div className="flex flex-col gap-5 border-2">
                    <p className="border-b text-xl">{etudiant.DEFR}</p>
                    <p className="border-b text-xl">{etudiant.DEMATH}</p>
                    <p className="border-b text-xl">{etudiant.DEANG}</p>
                    <p className="border-b text-xl">{etudiant.DESVT}</p>
                  </div>
                </td>
                <td className="text-start">
                  <div className="flex flex-col gap-5 border-2">
                    <p className="border-b text-xl">{etudiant.MFR}</p>
                    <p className="border-b text-xl">{etudiant.MMATH}</p>
                    <p className="border-b text-xl">{etudiant.MANG}</p>
                    <p className="border-b text-xl">{etudiant.MSVT}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* Moyenne Générale */}
          <div className="p-5 flex justify-end">
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-bold">Moyenne Générale:</h1>
              <p className="text-2xl">{etudiant.moyenne}</p>
            </div>
          </div>
        </div>

        {/* Bouton de fermeture */}
        <div className="flex w-full justify-end">
          <Link to="/">
            <RxCross1 className="text-4xl hover:text-red-500 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Affichage;