import Navbar from "./Components/Nav"; // ✅ Import SIEMPRE va arriba

function App() { // ✅ Definición de la función
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default App; // ✅ Export SIEMPRE va al final, fuera de la función

