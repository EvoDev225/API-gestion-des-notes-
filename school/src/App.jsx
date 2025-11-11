import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./Component/Login"
import Liste from "./Component/Dashboard/Liste"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/liste" element={<Liste/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
