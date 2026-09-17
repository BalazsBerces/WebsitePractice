import { Fragment, useState } from "react";
import { request } from "../api/api";

function Rooms({ rooms, reload }) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [editDrafts, setEditDrafts] = useState({});

    async function addRoom(event) {
        event.preventDefault();

        try {
            await request("/rooms", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    capacity: Number(capacity)
                })
            });

            setName("");
            setCapacity("");

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    function startEdit(room) {
        setEditDrafts((prev) => {
            if (prev[room.id]) {
                const next = { ...prev };
                delete next[room.id];
                return next;
            }

            return {
                ...prev,
                [room.id]: {
                    name: room.name,
                    capacity: String(room.capacity),
                    error: ""
                }
            };
        });
    }

    function updateDraft(roomId, field, value) {
        setEditDrafts((prev) => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                [field]: value
            }
        }));
    }

    function cancelEdit(roomId) {
        setEditDrafts((prev) => {
            const next = { ...prev };
            delete next[roomId];
            return next;
        });
    }

    async function saveEdit(event, roomId) {
        event.preventDefault();

        const draft = editDrafts[roomId];

        try {
            await request(`/rooms/${roomId}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: draft.name,
                    capacity: Number(draft.capacity)
                })
            });

            cancelEdit(roomId);
            await reload();
        } catch (error) {
            updateDraft(roomId, "error", error.message);
        }
    }

    async function deleteRoom(id) {
        try {
            await request(`/rooms/${id}`, {
                method: "DELETE"
            });

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section>
            <h2>Rooms</h2>

            <form onSubmit={addRoom}>
                <input
                    type="text"
                    placeholder="Room name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />

                <input
                    type="number"
                    placeholder="Capacity"
                    min="1"
                    value={capacity}
                    onChange={(event) =>
                        setCapacity(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    Add room
                </button>
            </form>

            <div className="cards">
                {rooms.map((room) => (
                    <Fragment key={room.id}>
                        <div className="card">
                            <div>
                                <strong>{room.name}</strong>

                                <span>
                                    {room.capacity} seats
                                </span>

                                <small>
                                    ID: {room.id}
                                </small>
                            </div>

                            <div className="actions">
                                <button
                                    onClick={() =>
                                        startEdit(room)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger"
                                    onClick={() =>
                                        deleteRoom(room.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {editDrafts[room.id] && (
                            <form
                                className="edit-panel"
                                onSubmit={(event) =>
                                    saveEdit(event, room.id)
                                }
                            >
                                <input
                                    type="text"
                                    placeholder="Room name"
                                    value={editDrafts[room.id].name}
                                    onChange={(event) =>
                                        updateDraft(
                                            room.id,
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Capacity"
                                    value={editDrafts[room.id].capacity}
                                    onChange={(event) =>
                                        updateDraft(
                                            room.id,
                                            "capacity",
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
                                            cancelEdit(room.id)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {editDrafts[room.id].error && (
                                    <p className="edit-error">
                                        {editDrafts[room.id].error}
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

export default Rooms;