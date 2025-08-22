import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

export default function APP() {
  return(
    <Routes>
      <Route path="/" element ={<HomePage />} />
    </Routes>
  );
}
  
