import { Routes, Route } from "react-router-dom";
import ListProfessor from "./pages/ListProfessor";
import ListStudent from "./pages/ListStudent";
import LiveProfessor from "./pages/LiveProfessor";
import LiveStudent from "./pages/LiveStudent";
import MainLogin from "./pages/MainLogin";
import QAProfessor from "./pages/QAProfessor";
import QAStudent from "./pages/QAStudent";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLogin />} />
				<Route path="/listp" element={<ListProfessor />} />
				<Route path="/lists" element={<ListStudent />} />
				<Route path="/livep" element={<LiveProfessor />} />
				<Route path="/lives" element={<LiveStudent />} />
				<Route path="/qp" element={<QAProfessor />} />
				<Route path="/qs" element={<QAStudent />} />
			</Routes>
		</>
	);
}

export default App;