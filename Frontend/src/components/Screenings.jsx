import { Fragment, useState } from "react";
import { request } from "../api/api";

function Screenings({
                        screenings,
                        movies,
                        rooms,
                        reload
                    }) {
    const [movieId, setMovieId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [editDrafts, setEditDrafts] = useState({});

    async function addScreening(event) {
        event.preventDefault();

        try {
            await request("/screenings", {
                method: "POST",
                body: JSON.stringify({
                    movieId: Number(movieId),
                    roomId: Number(roomId),
                    startTime: startTime
                })
            });

            setMovieId("");
            setRoomId("");
            setStartTime("");

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    function startEdit(screening) {
        setEditDrafts((prev) => {
            if (prev[screening.id]) {
                const next = { ...prev };
                delete next[screening.id];
                return next;
            }

            return {
                ...prev,
                [screening.id]: {
                    movieId: String(screening.movie?.id ?? ""),
                    roomId: String(screening.room?.id ?? ""),
                    startTime: screening.startTime
                        ? screening.startTime.slice(0, 16)
                        : "",
                    error: ""
                }
            };
        });
    }

    function updateDraft(screeningId, field, value) {
        setEditDrafts((prev) => ({
            ...prev,
            [screeningId]: {
                ...prev[screeningId],
                [field]: value
            }
        }));
    }

    function cancelEdit(screeningId) {
        setEditDrafts((prev) => {
            const next = { ...prev };
            delete next[screeningId];
            return next;
        });
    }

    async function saveEdit(event, screeningId) {
        event.preventDefault();

        const draft = editDrafts[screeningId];

        try {
            await request(`/screenings/${screeningId}`, {
                method: "PUT",
                body: JSON.stringify({
                    movieId: Number(draft.movieId),
                    roomId: Number(draft.roomId),
                    startTime: draft.startTime
                })
            });

            cancelEdit(screeningId);
            await reload();
        } catch (error) {
            updateDraft(screeningId, "error", error.message);
        }
    }

    async function deleteScreening(id) {
        try {
            await request(`/screenings/${id}`, {
                method: "DELETE"
            });

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section>
            <h2>Screenings</h2>

            <form onSubmit={addScreening}>
                <select
                    value={movieId}
                    onChange={(event) =>
                        setMovieId(event.target.value)
                    }
                    required
                >
                    <option value="">
                        Select movie
                    </option>

                    {movies.map((movie) => (
                        <option
                            key={movie.id}
                            value={movie.id}
                        >
                            {movie.title}
                        </option>
                    ))}
                </select>

                <select
                    value={roomId}
                    onChange={(event) =>
                        setRoomId(event.target.value)
                    }
                    required
                >
                    <option value="">
                        Select room
                    </option>

                    {rooms.map((room) => (
                        <option
                            key={room.id}
                            value={room.id}
                        >
                            {room.name}
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(event) =>
                        setStartTime(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    Add screening
                </button>
            </form>

            <div className="cards">
                {screenings.map((screening) => (
                    <Fragment key={screening.id}>
                        <div className="card">
                            <div>
                                <strong>
                                    {screening.movie?.title}
                                </strong>

                                <span>
                                    Room: {screening.room?.name}
                                </span>

                                <span>
                                    {screening.startTime?.replace(
                                        "T",
                                        " "
                                    )}
                                </span>

                                <small>
                                    ID: {screening.id}
                                </small>
                            </div>

                            <div className="actions">
                                <button
                                    onClick={() =>
                                        startEdit(screening)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger"
                                    onClick={() =>
                                        deleteScreening(screening.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {editDrafts[screening.id] && (
                            <form
                                className="edit-panel"
                                onSubmit={(event) =>
                                    saveEdit(event, screening.id)
                                }
                            >
                                <select
                                    value={editDrafts[screening.id].movieId}
                                    onChange={(event) =>
                                        updateDraft(
                                            screening.id,
                                            "movieId",
                                            event.target.value
                                        )
                                    }
                                    required
                                >
                                    {movies.map((movie) => (
                                        <option
                                            key={movie.id}
                                            value={movie.id}
                                        >
                                            {movie.title}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={editDrafts[screening.id].roomId}
                                    onChange={(event) =>
                                        updateDraft(
                                            screening.id,
                                            "roomId",
                                            event.target.value
                                        )
                                    }
                                    required
                                >
                                    {rooms.map((room) => (
                                        <option
                                            key={room.id}
                                            value={room.id}
                                        >
                                            {room.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="datetime-local"
                                    value={editDrafts[screening.id].startTime}
                                    onChange={(event) =>
                                        updateDraft(
                                            screening.id,
                                            "startTime",
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
                                            cancelEdit(screening.id)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {editDrafts[screening.id].error && (
                                    <p className="edit-error">
                                        {editDrafts[screening.id].error}
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

export default Screenings;