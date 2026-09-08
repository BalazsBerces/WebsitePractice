package com.practice.moviewebsite.service;

import com.practice.moviewebsite.dto.BookingRequest;
import com.practice.moviewebsite.model.Booking;
import com.practice.moviewebsite.model.Screening;
import com.practice.moviewebsite.repository.BookingRepository;
import com.practice.moviewebsite.repository.ScreeningRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ScreeningRepository screeningRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ScreeningRepository screeningRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.screeningRepository = screeningRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking addBooking(BookingRequest request) {

        Screening screening = screeningRepository
                .findById(request.getScreeningId())
                .orElse(null);

        if (screening == null) {
            return null;
        }

        int capacity = screening.getRoom().getCapacity();

        List<Booking> bookings =
                bookingRepository.findByScreeningId(screening.getId());

        int alreadyBooked = 0;

        for (Booking booking : bookings) {
            alreadyBooked += booking.getTicketCount();
        }

        if (alreadyBooked + request.getTicketCount() > capacity) {
            return null;
        }

        Booking booking = new Booking(
                request.getCustomerName(),
                screening,
                request.getTicketCount()
        );

        return bookingRepository.save(booking);
    }
}
