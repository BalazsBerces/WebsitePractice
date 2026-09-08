package com.practice.moviewebsite.repository;

import com.practice.moviewebsite.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {
}
