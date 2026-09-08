package com.practice.moviewebsite.repository;

import com.practice.moviewebsite.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
