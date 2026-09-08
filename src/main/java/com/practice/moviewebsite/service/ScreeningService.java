package com.practice.moviewebsite.service;

import com.practice.moviewebsite.dto.ScreeningRequest;
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
                .orElse(null);
    }

    public Screening addScreening(ScreeningRequest request) {

        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElse(null);

        Room room = roomRepository
                .findById(request.getRoomId())
                .orElse(null);

        if (movie == null || room == null) {
            return null;
        }

        Screening screening = new Screening(
                movie,
                room,
                request.getStartTime().toLocalDate()
        );

        return screeningRepository.save(screening);
    }
}
