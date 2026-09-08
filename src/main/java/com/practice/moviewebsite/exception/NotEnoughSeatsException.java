package com.practice.moviewebsite.exception;

public class NotEnoughSeatsException extends RuntimeException {

    public NotEnoughSeatsException(int requested, int available) {
        super(
                "Not enough available seats. Requested: "
                        + requested
                        + ", available: "
                        + available
        );
    }
}
