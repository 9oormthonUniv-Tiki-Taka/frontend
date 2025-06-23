import Header from "./components/Header";
import ListProfessor from "./pages/ListStudent";

function App() {
  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {/* ✅ 헤더는 전체 너비 차지 */}
      <Header />

      {/* ✅ 본문은 가운데 정렬 */}
      <div className="max-w-6xl w-full mx-auto">
        <ListProfessor />
      </div>
    </div>
  );
}
export default App;
