import { Routes, Route } from "react-router-dom";
import ListProfessor from "./pages/ListProfessor";
import LiveProfessor from "./pages/LiveProfessor";
import LiveStudent from "./pages/LiveStudent";
import MainLogin from "./pages/MainLogin";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLogin />} />
				<Route path="/listp" element={<ListProfessor />} />
				<Route path="/livep" element={<LiveProfessor />} />
				<Route path="/lives" element={<LiveStudent />} />
			</Routes>
		</>
	);
}

export default App;