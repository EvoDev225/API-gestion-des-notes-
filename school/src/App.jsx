import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./Component/Login"
import Liste from "./Component/Dashboard/Liste"
import Register from "./Component/Dashboard/Register"
import Notes from "./Component/Dashboard/Notes"
import Affichage from "./Component/Dashboard/Affichage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/liste" element={<Liste/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/note" element={<Notes/>}></Route>
            <Route path="/affichage/:id" element={<Affichage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
