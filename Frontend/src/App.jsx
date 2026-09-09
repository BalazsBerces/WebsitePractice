import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";

function App() {
  const [activeTab, setActiveTab] = useState("movies");

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [message, setMessage] = useState("");

  const [movieTitle, setMovieTitle] = useState("");

  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");

  const [screeningMovieId, setScreeningMovieId] = useState("");
  const [screeningRoomId, setScreeningRoomId] = useState("");
  const [screeningTime, setScreeningTime] = useState("");

  const [bookingScreeningId, setBookingScreeningId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    loadEverything();
  }, []);

  async function request(url, options = {}) {
    const response = await fetch(API_URL + url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  }

  async function loadEverything() {
    try {
      const [moviesData, roomsData, screeningsData, bookingsData] =
          await Promise.all([
            request("/movies"),
            request("/rooms"),
            request("/screenings"),
            request("/bookings"),
          ]);

      setMovies(moviesData ?? []);
      setRooms(roomsData ?? []);
      setScreenings(screeningsData ?? []);
      setBookings(bookingsData ?? []);
    } catch (error) {
      showMessage(error.message);
    }
  }

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  }

  // ---------------- MOVIES ----------------

  async function addMovie(event) {
    event.preventDefault();

    try {
      await request("/movies", {
        method: "POST",
        body: JSON.stringify({
          title: movieTitle,
        }),
      });

      setMovieTitle("");
      showMessage("Film hozzáadva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function editMovie(movie) {
    const newTitle = window.prompt("Új cím:", movie.title);

    if (!newTitle) {
      return;
    }

    try {
      await request(`/movies/${movie.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      showMessage("Film módosítva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function deleteMovie(id) {
    try {
      await request(`/movies/${id}`, {
        method: "DELETE",
      });

      showMessage("Film törölve.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  // ---------------- ROOMS ----------------

  async function addRoom(event) {
    event.preventDefault();

    try {
      await request("/rooms", {
        method: "POST",
        body: JSON.stringify({
          name: roomName,
          capacity: Number(roomCapacity),
        }),
      });

      setRoomName("");
      setRoomCapacity("");

      showMessage("Terem hozzáadva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function editRoom(room) {
    const newName = window.prompt("Terem neve:", room.name);

    if (!newName) {
      return;
    }

    const newCapacity = window.prompt(
        "Kapacitás:",
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
          capacity: Number(newCapacity),
        }),
      });

      showMessage("Terem módosítva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function deleteRoom(id) {
    try {
      await request(`/rooms/${id}`, {
        method: "DELETE",
      });

      showMessage("Terem törölve.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  // ---------------- SCREENINGS ----------------

  async function addScreening(event) {
    event.preventDefault();

    try {
      await request("/screenings", {
        method: "POST",
        body: JSON.stringify({
          movieId: Number(screeningMovieId),
          roomId: Number(screeningRoomId),
          startTime: screeningTime,
        }),
      });

      setScreeningMovieId("");
      setScreeningRoomId("");
      setScreeningTime("");

      showMessage("Vetítés létrehozva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  // ---------------- BOOKINGS ----------------

  async function addBooking(event) {
    event.preventDefault();

    try {
      await request("/bookings", {
        method: "POST",
        body: JSON.stringify({
          screeningId: Number(bookingScreeningId),
          customerName,
          ticketCount: Number(ticketCount),
        }),
      });

      setBookingScreeningId("");
      setCustomerName("");
      setTicketCount(1);

      showMessage("Foglalás létrehozva.");
      loadEverything();
    } catch (error) {
      showMessage(error.message);
    }
  }

  return (
      <div className="app">
        <header>
          <h1>Movie Cinema</h1>

        </header>

        <nav>
          <button
              className={activeTab === "movies" ? "active" : ""}
              onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>

          <button
              className={activeTab === "rooms" ? "active" : ""}
              onClick={() => setActiveTab("rooms")}
          >
            Rooms
          </button>

          <button
              className={activeTab === "screenings" ? "active" : ""}
              onClick={() => setActiveTab("screenings")}
          >
            Screenings
          </button>

          <button
              className={activeTab === "bookings" ? "active" : ""}
              onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </nav>

        {message && <div className="message">{message}</div>}

        <main>
          {activeTab === "movies" && (
              <section>
                <h2>Movies</h2>

                <form onSubmit={addMovie}>
                  <input
                      type="text"
                      placeholder="Movie title"
                      value={movieTitle}
                      onChange={(e) => setMovieTitle(e.target.value)}
                      required
                  />

                  <button type="submit">Add movie</button>
                </form>

                <div className="cards">
                  {movies.map((movie) => (
                      <div className="card" key={movie.id}>
                        <div>
                          <strong>{movie.title}</strong>
                          <small>ID: {movie.id}</small>
                        </div>

                        <div className="actions">
                          <button onClick={() => editMovie(movie)}>
                            Edit
                          </button>

                          <button
                              className="danger"
                              onClick={() => deleteMovie(movie.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
          )}

          {activeTab === "rooms" && (
              <section>
                <h2>Rooms</h2>

                <form onSubmit={addRoom}>
                  <input
                      type="text"
                      placeholder="Room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                  />

                  <input
                      type="number"
                      placeholder="Capacity"
                      min="1"
                      value={roomCapacity}
                      onChange={(e) => setRoomCapacity(e.target.value)}
                      required
                  />

                  <button type="submit">Add room</button>
                </form>

                <div className="cards">
                  {rooms.map((room) => (
                      <div className="card" key={room.id}>
                        <div>
                          <strong>{room.name}</strong>
                          <span>{room.capacity} seats</span>
                          <small>ID: {room.id}</small>
                        </div>

                        <div className="actions">
                          <button onClick={() => editRoom(room)}>
                            Edit
                          </button>

                          <button
                              className="danger"
                              onClick={() => deleteRoom(room.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
          )}

          {activeTab === "screenings" && (
              <section>
                <h2>Screenings</h2>

                <form onSubmit={addScreening}>
                  <select
                      value={screeningMovieId}
                      onChange={(e) =>
                          setScreeningMovieId(e.target.value)
                      }
                      required
                  >
                    <option value="">Select movie</option>

                    {movies.map((movie) => (
                        <option key={movie.id} value={movie.id}>
                          {movie.title}
                        </option>
                    ))}
                  </select>

                  <select
                      value={screeningRoomId}
                      onChange={(e) =>
                          setScreeningRoomId(e.target.value)
                      }
                      required
                  >
                    <option value="">Select room</option>

                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                    ))}
                  </select>

                  <input
                      type="datetime-local"
                      value={screeningTime}
                      onChange={(e) =>
                          setScreeningTime(e.target.value)
                      }
                      required
                  />

                  <button type="submit">
                    Add screening
                  </button>
                </form>

                <div className="cards">
                  {screenings.map((screening) => (
                      <div className="card" key={screening.id}>
                        <div>
                          <strong>
                            {screening.movie?.title}
                          </strong>

                          <span>
                      {screening.room?.name}
                    </span>

                          <span>
                      {screening.startTime?.replace("T", " ")}
                    </span>

                          <small>ID: {screening.id}</small>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
          )}

          {activeTab === "bookings" && (
              <section>
                <h2>Bookings</h2>

                <form onSubmit={addBooking}>
                  <select
                      value={bookingScreeningId}
                      onChange={(e) =>
                          setBookingScreeningId(e.target.value)
                      }
                      required
                  >
                    <option value="">Select screening</option>

                    {screenings.map((screening) => (
                        <option
                            key={screening.id}
                            value={screening.id}
                        >
                          {screening.movie?.title}
                          {" — "}
                          {screening.room?.name}
                          {" — "}
                          {screening.startTime?.replace("T", " ")}
                        </option>
                    ))}
                  </select>

                  <input
                      type="text"
                      placeholder="Customer name"
                      value={customerName}
                      onChange={(e) =>
                          setCustomerName(e.target.value)
                      }
                      required
                  />

                  <input
                      type="number"
                      min="1"
                      placeholder="Tickets"
                      value={ticketCount}
                      onChange={(e) =>
                          setTicketCount(e.target.value)
                      }
                      required
                  />

                  <button type="submit">
                    Book tickets
                  </button>
                </form>

                <div className="cards">
                  {bookings.map((booking) => (
                      <div className="card" key={booking.id}>
                        <div>
                          <strong>
                            {booking.customerName}
                          </strong>

                          <span>
                      {booking.ticketCount} ticket(s)
                    </span>

                          <span>
                      {booking.screening?.movie?.title}
                    </span>

                          <small>
                            Booking ID: {booking.id}
                          </small>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
          )}
        </main>
      </div>
  );
}

export default App;