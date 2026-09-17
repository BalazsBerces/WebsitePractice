import { Fragment, useState } from "react";
import { request } from "../api/api";

function Bookings({
                      bookings,
                      screenings,
                      reload
                  }) {
    const [screeningId, setScreeningId] =
        useState("");

    const [customerName, setCustomerName] =
        useState("");

    const [ticketCount, setTicketCount] =
        useState(1);

    const [editDrafts, setEditDrafts] = useState({});

    async function addBooking(event) {
        event.preventDefault();

        try {
            await request("/bookings", {
                method: "POST",
                body: JSON.stringify({
                    screeningId: Number(screeningId),
                    customerName: customerName,
                    ticketCount: Number(ticketCount)
                })
            });

            setScreeningId("");
            setCustomerName("");
            setTicketCount(1);

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    function startEdit(booking) {
        setEditDrafts((prev) => {
            if (prev[booking.id]) {
                const next = { ...prev };
                delete next[booking.id];
                return next;
            }

            return {
                ...prev,
                [booking.id]: {
                    screeningId: String(booking.screening?.id ?? ""),
                    customerName: booking.customerName,
                    ticketCount: String(booking.ticketCount),
                    error: ""
                }
            };
        });
    }

    function updateDraft(bookingId, field, value) {
        setEditDrafts((prev) => ({
            ...prev,
            [bookingId]: {
                ...prev[bookingId],
                [field]: value
            }
        }));
    }

    function cancelEdit(bookingId) {
        setEditDrafts((prev) => {
            const next = { ...prev };
            delete next[bookingId];
            return next;
        });
    }

    async function saveEdit(event, bookingId) {
        event.preventDefault();

        const draft = editDrafts[bookingId];

        try {
            await request(`/bookings/${bookingId}`, {
                method: "PUT",
                body: JSON.stringify({
                    screeningId: Number(draft.screeningId),
                    customerName: draft.customerName,
                    ticketCount: Number(draft.ticketCount)
                })
            });

            cancelEdit(bookingId);
            await reload();
        } catch (error) {
            updateDraft(bookingId, "error", error.message);
        }
    }

    async function deleteBooking(id) {
        try {
            await request(`/bookings/${id}`, {
                method: "DELETE"
            });

            await reload();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section>
            <h2>Bookings</h2>

            <form onSubmit={addBooking}>
                <select
                    value={screeningId}
                    onChange={(event) =>
                        setScreeningId(
                            event.target.value
                        )
                    }
                    required
                >
                    <option value="">
                        Select screening
                    </option>

                    {screenings.map((screening) => (
                        <option
                            key={screening.id}
                            value={screening.id}
                        >
                            {screening.movie?.title}
                            {" - "}
                            {screening.room?.name}
                            {" - "}
                            {screening.startTime?.replace(
                                "T",
                                " "
                            )}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(event) =>
                        setCustomerName(
                            event.target.value
                        )
                    }
                    required
                />

                <input
                    type="number"
                    min="1"
                    placeholder="Tickets"
                    value={ticketCount}
                    onChange={(event) =>
                        setTicketCount(
                            event.target.value
                        )
                    }
                    required
                />

                <button type="submit">
                    Book tickets
                </button>
            </form>

            <div className="cards">
                {bookings.map((booking) => (
                    <Fragment key={booking.id}>
                        <div className="card">
                            <div>
                                <strong>
                                    {booking.customerName}
                                </strong>

                                <span>
                                    {booking.ticketCount} ticket(s)
                                </span>

                                <span>
                                    {
                                        booking.screening
                                            ?.movie?.title
                                    }
                                </span>

                                <span>
                                    {
                                        booking.screening
                                            ?.room?.name
                                    }
                                </span>

                                <small>
                                    Booking ID: {booking.id}
                                </small>
                            </div>

                            <div className="actions">
                                <button
                                    onClick={() =>
                                        startEdit(booking)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger"
                                    onClick={() =>
                                        deleteBooking(booking.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {editDrafts[booking.id] && (
                            <form
                                className="edit-panel"
                                onSubmit={(event) =>
                                    saveEdit(event, booking.id)
                                }
                            >
                                <select
                                    value={editDrafts[booking.id].screeningId}
                                    onChange={(event) =>
                                        updateDraft(
                                            booking.id,
                                            "screeningId",
                                            event.target.value
                                        )
                                    }
                                    required
                                >
                                    {screenings.map((screening) => (
                                        <option
                                            key={screening.id}
                                            value={screening.id}
                                        >
                                            {screening.movie?.title}
                                            {" - "}
                                            {screening.room?.name}
                                            {" - "}
                                            {screening.startTime?.replace(
                                                "T",
                                                " "
                                            )}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Customer name"
                                    value={editDrafts[booking.id].customerName}
                                    onChange={(event) =>
                                        updateDraft(
                                            booking.id,
                                            "customerName",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Tickets"
                                    value={editDrafts[booking.id].ticketCount}
                                    onChange={(event) =>
                                        updateDraft(
                                            booking.id,
                                            "ticketCount",
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
                                            cancelEdit(booking.id)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {editDrafts[booking.id].error && (
                                    <p className="edit-error">
                                        {editDrafts[booking.id].error}
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

export default Bookings;