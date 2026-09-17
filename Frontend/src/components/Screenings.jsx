import { useState } from "react";
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

    async function editScreening(screening) {
        const movieOptions = movies
            .map((movie) => `${movie.id}: ${movie.title}`)
            .join("\n");

        const newMovieId = window.prompt(
            `Movie ID:\n${movieOptions}`,
            screening.movie?.id
        );

        if (!newMovieId) {
            return;
        }

        const roomOptions = rooms
            .map((room) => `${room.id}: ${room.name}`)
            .join("\n");

        const newRoomId = window.prompt(
            `Room ID:\n${roomOptions}`,
            screening.room?.id
        );

        if (!newRoomId) {
            return;
        }

        const newStartTime = window.prompt(
            "Start time (YYYY-MM-DDTHH:mm):",
            screening.startTime
        );

        if (!newStartTime) {
            return;
        }

        try {
            await request(`/screenings/${screening.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    movieId: Number(newMovieId),
                    roomId: Number(newRoomId),
                    startTime: newStartTime
                })
            });

            await reload();
        } catch (error) {
            alert(error.message);
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
                    <div
                        className="card"
                        key={screening.id}
                    >
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
                                    editScreening(screening)
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
                ))}
            </div>
        </section>
    );
}

export default Screenings;