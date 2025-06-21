import { Routes, Route } from "react-router-dom";
import ListProfessor from "./pages/ListProfessor";
import LiveProfessor from "./pages/LiveProfessor";
import MainLogin from "./pages/MainLogin";
import QAProfessor from "./pages/QAProfessor";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLogin />} />
				<Route path="/listp" element={<ListProfessor />} />
				<Route path="/livep" element={<LiveProfessor />} />
				<Route path="/qp" element={<QAProfessor />} />
			</Routes>
		</>
	);
}

export default App;