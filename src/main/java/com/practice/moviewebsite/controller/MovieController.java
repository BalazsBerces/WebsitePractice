package com.practice.moviewebsite.controller;

import com.practice.moviewebsite.model.Movie;
import com.practice.moviewebsite.service.MovieService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }

    @GetMapping("/movies")
    public List<Movie> getMovies(){
        return movieService.getMovies();
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id){
        Movie movie = movieService.getMovieById(id);

        if (movie == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(200).body(movie);
    }

    @PostMapping("/movies")
    public Movie addMovie(@Valid  @RequestBody Movie movie){
        return movieService.addMovie(movie);
    }

    @PutMapping("/movies/{id}")
    public Movie changeMovie(@PathVariable Long id,@Valid @RequestBody Movie movie){
        return movieService.changeMovieTitle(id, movie);
    }

    @DeleteMapping("/movies/{id}")
    public Movie deleteMovie(@PathVariable Long id){
        return movieService.deleteMovie(id);
    }
}
