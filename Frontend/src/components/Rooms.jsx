import { useState } from "react";
import { request } from "../api/api";

function Rooms({ rooms, reload }) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");

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

    async function editRoom(room) {
        const newName = window.prompt(
            "Room name:",
            room.name
        );

        if (!newName) {
            return;
        }

        const newCapacity = window.prompt(
            "Room capacity:",
            room.capacity
        );

        if (!newCapacity) {
            return;
        }

        try {
            await request(`/rooms/${room.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: newName,
                    capacity: Number(newCapacity)
                })
            });

            await reload();
        } catch (error) {
            alert(error.message);
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
                    <div
                        className="card"
                        key={room.id}
                    >
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
                                    editRoom(room)
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
                ))}
            </div>
        </section>
    );
}

export default Rooms;