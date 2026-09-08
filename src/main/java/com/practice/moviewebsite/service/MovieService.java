package com.practice.moviewebsite.service;

import com.practice.moviewebsite.model.Movie;
import com.practice.moviewebsite.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository){
        this.movieRepository = movieRepository;
        }


    public List<Movie> getMovies(){
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id){
        return movieRepository.findById(id).orElse(null);
    }

    public Movie addMovie(Movie movie){
        return movieRepository.save(movie);
    }

    public Movie changeMovieTitle(Long id, Movie updatedMovie){
        Movie movie = movieRepository.findById(id).orElse(null);

        if (movie == null){
            return null;
        }

        movie.setTitle(updatedMovie.getTitle());
        return movieRepository.save(movie);
    }

    public Movie deleteMovie(Long id){
        Movie movie = movieRepository.findById(id).orElse(null);
        if (movie == null){
            return null;
        }
        movieRepository.delete(movie);

        return movie;
    }
}
