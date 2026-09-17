function Navigation({ activeTab, setActiveTab }) {
    return (
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
    );
}

export default Navigation;