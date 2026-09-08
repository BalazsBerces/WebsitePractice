package com.practice.moviewebsite.repository;

import com.practice.moviewebsite.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
