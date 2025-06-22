import Header from "./components/Header";
import ListProfessor from "./pages/ListProfessor";

function App() {
  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <Header />
      <main className="max-w-screen-lg mx-auto">
        <ListProfessor />
      </main>
    </div>
  );
}

export default App;
