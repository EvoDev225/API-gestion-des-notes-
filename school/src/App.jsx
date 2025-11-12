import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./Component/Login"
import Liste from "./Component/Dashboard/Liste"
import Register from "./Component/Dashboard/Register"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/liste" element={<Liste/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
