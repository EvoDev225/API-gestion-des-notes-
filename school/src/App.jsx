import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./Component/Login"
import Liste from "./Component/Dashboard/Liste"
import Register from "./Component/Dashboard/Register"
import Notes from "./Component/Dashboard/Notes"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/liste" element={<Liste/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/note" element={<Notes/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
