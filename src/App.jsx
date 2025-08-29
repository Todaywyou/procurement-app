import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./components/login";

export default function APP() {
  return(
    <Routes>
      <Route path="/" element ={<Login />} />
      <Route path="das" element={<HomePage/>}/>
    </Routes>
  );
}
  
