
import { Link } from "react-router-dom"
const Navbar = () => {
  return (
     <div className=" fixed top-50  bg-white h-[70vh]  mx-10 flex flex-col rounded-3xl py-20 gap-20 w-80">
                <div className=" px-10">
                    <h1 className="font-bold text-2xl">
                        Bienvenue  <br />chez administrateur
                    </h1>
                </div>
                <div className=" grid gap-12 w-full">
                    <Link to="/register" className="w-full"><p href="" className="  duration-100 transition-all hover:shadow   text-xl font-medium p-4    hover:border-l-5 hover:border-blue-400 ">Ajout des étudiants</p></Link>
                    <Link to="/" className="w-full"><p href="" className="  duration-100 transition-all hover:shadow   text-xl font-medium p-4    hover:border-l-5 hover:border-green-400 ">Ajout des notes</p></Link>
                    <Link to="/liste" className="w-full"><p href="" className="  duration-100 transition-all hover:shadow   text-xl font-medium p-4    hover:border-l-5 hover:border-red-400 ">Liste des étudiants</p></Link>
                </div>
            </div>
  )
}

export default Navbar
