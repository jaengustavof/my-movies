import { Carousel } from "../components/Carousel";

export const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Descubre películas increíbles</h1>
        <p>Terror, Acción y Ciencia Ficción</p>
      </section>

      <section className="categories">
        <Carousel genreId={27} title="Terror" genre="horror" />

        <Carousel genreId={28} title="Acción" genre="action" />

        <Carousel genreId={878} title="Ciencia Ficción" genre="sci-fi" />
      </section>
    </div>
  );
};
