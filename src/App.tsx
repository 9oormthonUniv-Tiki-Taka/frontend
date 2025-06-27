import { Routes, Route } from "react-router-dom";
import ListProfessor from "./pages/ListProfessor";
import LiveProfessor from "./pages/LiveProfessor";
import LiveStudent from "./pages/LiveStudent";
import MainLogin from "./pages/MainLogin";
import QAProfessor from "./pages/QAProfessor";
import QAStudent from "./pages/QAStudent";
import OAuthCallback from "./pages/OAuthCallback";


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLogin />} />
				<Route path="/listp" element={<ListProfessor />} />
				<Route path="/livep" element={<LiveProfessor />} />
				<Route path="/lives" element={<LiveStudent />} />
				<Route path="/qp" element={<QAProfessor />} />
				<Route path="/qs" element={<QAStudent />} />
				<Route path="/oauth/callback" element={<OAuthCallback />} />
			</Routes>
		</>
	);
}

export default App;