import { MainLayout } from "./layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { FavoritesPage } from "./pages/Favourites";
import "./styles/index.scss";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
