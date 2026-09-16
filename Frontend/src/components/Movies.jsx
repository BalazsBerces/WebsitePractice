import { useState } from "react";
import { request } from "../api/api";

function Movies({ movies, reload }) {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");

    async function addMovie(event) {
        event.preventDefault();

        try {
            await request("/movies", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    rating: Number(rating)
                })
            });

            setTitle("");
            setRating("");
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

        const newRating = window.prompt(
            "New rating (0-10):",
            movie.rating
        );

        if (!newRating) {
            return;
        }

        try {
            await request(`/movies/${movie.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: newTitle,
                    rating: Number(newRating)
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

                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Rating (0-10)"
                    value={rating}
                    onChange={(event) =>
                        setRating(event.target.value)
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
                            <span>Rating: {movie.rating}</span>
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