package com.practice.moviewebsite.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startTime;

    @ManyToOne
    private Movie movie;

    @ManyToOne
    private Room room;

    protected Screening(){}

    public  Screening(Movie movie, Room room, LocalDate startTime){
        this.movie = movie;
        this.room = room;
        this.startTime = startTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDate startTime) {
        this.startTime = startTime;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}
