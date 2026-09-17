package com.practice.moviewebsite.controller;

import com.practice.moviewebsite.dto.BookingRequest;
import com.practice.moviewebsite.model.Booking;
import com.practice.moviewebsite.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    public Booking addBooking(
            @RequestBody BookingRequest request
    ) {
        return bookingService.addBooking(request);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request
    ) {
        return bookingService.updateBooking(id, request);
    }

    @DeleteMapping("/{id}")
    public Booking deleteBooking(@PathVariable Long id) {
        return bookingService.deleteBooking(id);
    }
}
