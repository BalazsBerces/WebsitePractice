import { useEffect, useState } from "react";

import "./App.css";

import Navigation from "./components/Navigation";
import Movies from "./components/Movies";
import Rooms from "./components/Rooms";
import Screenings from "./components/Screenings";
import Bookings from "./components/Bookings";

import { request } from "./api/api";

function App() {
  const [activeTab, setActiveTab] = useState("movies");

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadEverything();
  }, []);

  async function loadEverything() {
    const moviesData = await request("/movies");
    const roomsData = await request("/rooms");
    const screeningsData = await request("/screenings");
    const bookingsData = await request("/bookings");

    setMovies(moviesData);
    setRooms(roomsData);
    setScreenings(screeningsData);
    setBookings(bookingsData);
  }

  return (
      <div className="app">

        <header>
          <h1>Movie Cinema</h1>
        </header>

        <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />

        <main>
          {activeTab === "movies" && (
              <Movies
                  movies={movies}
                  reload={loadEverything}
              />
          )}

          {activeTab === "rooms" && (
              <Rooms
                  rooms={rooms}
                  reload={loadEverything}
              />
          )}

          {activeTab === "screenings" && (
              <Screenings
                  screenings={screenings}
                  movies={movies}
                  rooms={rooms}
                  reload={loadEverything}
              />
          )}

          {activeTab === "bookings" && (
              <Bookings
                  bookings={bookings}
                  screenings={screenings}
                  reload={loadEverything}
              />
          )}
        </main>

      </div>
  );
}

export default App;