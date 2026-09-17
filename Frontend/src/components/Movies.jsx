import { Fragment, useState } from "react";
import { request } from "../api/api";

function Movies({ movies, reload }) {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [editDrafts, setEditDrafts] = useState({});

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

    function startEdit(movie) {
        setEditDrafts((prev) => {
            if (prev[movie.id]) {
                const next = { ...prev };
                delete next[movie.id];
                return next;
            }

            return {
                ...prev,
                [movie.id]: {
                    title: movie.title,
                    rating: String(movie.rating),
                    error: ""
                }
            };
        });
    }

    function updateDraft(movieId, field, value) {
        setEditDrafts((prev) => ({
            ...prev,
            [movieId]: {
                ...prev[movieId],
                [field]: value
            }
        }));
    }

    function cancelEdit(movieId) {
        setEditDrafts((prev) => {
            const next = { ...prev };
            delete next[movieId];
            return next;
        });
    }

    async function saveEdit(event, movieId) {
        event.preventDefault();

        const draft = editDrafts[movieId];

        try {
            await request(`/movies/${movieId}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: draft.title,
                    rating: Number(draft.rating)
                })
            });

            cancelEdit(movieId);
            await reload();
        } catch (error) {
            updateDraft(movieId, "error", error.message);
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
                    <Fragment key={movie.id}>
                        <div className="card">
                            <div>
                                <strong>{movie.title}</strong>
                                <span>Rating: {movie.rating}</span>
                                <small>ID: {movie.id}</small>
                            </div>

                            <div className="actions">
                                <button
                                    onClick={() =>
                                        startEdit(movie)
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

                        {editDrafts[movie.id] && (
                            <form
                                className="edit-panel"
                                onSubmit={(event) =>
                                    saveEdit(event, movie.id)
                                }
                            >
                                <input
                                    type="text"
                                    placeholder="Movie title"
                                    value={editDrafts[movie.id].title}
                                    onChange={(event) =>
                                        updateDraft(
                                            movie.id,
                                            "title",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="Rating (0-10)"
                                    value={editDrafts[movie.id].rating}
                                    onChange={(event) =>
                                        updateDraft(
                                            movie.id,
                                            "rating",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <div className="actions">
                                    <button
                                        type="submit"
                                        className="primary"
                                    >
                                        Save
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            cancelEdit(movie.id)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {editDrafts[movie.id].error && (
                                    <p className="edit-error">
                                        {editDrafts[movie.id].error}
                                    </p>
                                )}
                            </form>
                        )}
                    </Fragment>
                ))}
            </div>
        </section>
    );
}

export default Movies;