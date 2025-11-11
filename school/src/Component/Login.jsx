import { useState, } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"
const Login = () => {
    
    const [value, setValue] = useState({
        code: ""
    })
    const [error, setError] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [test, setTest] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setTest(false)
        axios.post('http://localhost:3000', value)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate("/liste")
                    setError('')
                    setTest(false)
                } else {
                    setError(res.data.Message || 'Le matricule est incorrecte !')
                    setTest(true)
                }
            })
            .catch(err => {
                setError(err.response?.data?.Message || 'Une erreur est survenue !')
                setTest(true)
                console.log(err)
            })
    }
    return (
        <div className='  bg-[#dee2e6] min-h-screen flex items-center'>
            <div className=' bg-white rounded-3xl p-20  w-3xl mx-auto '>
                <div className="flex flex-col items-center justify-center gap-10 w-full ">
                    <div className="text-5xl">
                        <FaUser />
                    </div>
                    <div className=" w-full flex justify-center ">
                        <form onSubmit={handleSubmit} action=" " className="w-full  max-w-xl flex flex-col  gap-5">
                            <input onChange={e => setValue({ ...value, code: e.target.value })} name="code" id="code" type="text" placeholder="Entrez votre matricule" className=" px-6 py-5 shadown rounded-2xl border-b  focus:outline-none w-1/2 mx-auto" />
                            <div className="w-full flex justify-center items-center my-1">
                                <p className="text-red-500"> {error}</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <button type="submit" className=" px-6 py-2 duration-300 transition-colors hover:bg-blue-500 bg-blue-400 rounded-full text-white font-bold cursor-pointer">
                                    Se connecter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
