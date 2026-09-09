import { useState } from "react";
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
                    <div
                        className="card"
                        key={booking.id}
                    >
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
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Bookings;