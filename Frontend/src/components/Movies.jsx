import { useState } from "react";
import { request } from "../api/api";

function Movies({ movies, reload }) {
    const [title, setTitle] = useState("");

    async function addMovie(event) {
        event.preventDefault();

        try {
            await request("/movies", {
                method: "POST",
                body: JSON.stringify({
                    title: title
                })
            });

            setTitle("");
            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    async function editMovie(movie) {
        const newTitle = window.prompt(
            "New movie title:",
            movie.title
        );

        if (!newTitle) {
            return;
        }

        try {
            await request(`/movies/${movie.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: newTitle
                })
            });

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    async function deleteMovie(id) {
        try {
            await request(`/movies/${id}`, {
                method: "DELETE"
            });

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section>
            <h2>Movies</h2>

            <form onSubmit={addMovie}>
                <input
                    type="text"
                    placeholder="Movie title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    Add movie
                </button>
            </form>

            <div className="cards">
                {movies.map((movie) => (
                    <div
                        className="card"
                        key={movie.id}
                    >
                        <div>
                            <strong>{movie.title}</strong>
                            <small>ID: {movie.id}</small>
                        </div>

                        <div className="actions">
                            <button
                                onClick={() =>
                                    editMovie(movie)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger"
                                onClick={() =>
                                    deleteMovie(movie.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Movies;