package com.practice.moviewebsite.service;

import com.practice.moviewebsite.dto.ScreeningRequest;
import com.practice.moviewebsite.exception.ResourceNotFoundException;
import com.practice.moviewebsite.model.Movie;
import com.practice.moviewebsite.model.Room;
import com.practice.moviewebsite.model.Screening;
import com.practice.moviewebsite.repository.MovieRepository;
import com.practice.moviewebsite.repository.RoomRepository;
import com.practice.moviewebsite.repository.ScreeningRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    public ScreeningService(
            ScreeningRepository screeningRepository,
            MovieRepository movieRepository,
            RoomRepository roomRepository
    ) {
        this.screeningRepository = screeningRepository;
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
    }

    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }

    public Screening getScreeningById(Long id) {
        return screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening", id));
    }

    public Screening addScreening(ScreeningRequest request) {

        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", request.getMovieId()));

        Room room = roomRepository
                .findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", request.getRoomId()));

        Screening screening = new Screening(
                movie,
                room,
                request.getStartTime().toLocalDate()
        );

        return screeningRepository.save(screening);
    }

    public Screening updateScreening(Long id, ScreeningRequest request) {

        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening", id));

        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", request.getMovieId()));

        Room room = roomRepository
                .findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", request.getRoomId()));

        screening.setMovie(movie);
        screening.setRoom(room);
        screening.setStartTime(request.getStartTime().toLocalDate());

        return screeningRepository.save(screening);
    }

    public Screening deleteScreening(Long id) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening", id));

        screeningRepository.delete(screening);
        return screening;
    }
}
