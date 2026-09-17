package com.practice.moviewebsite.controller;

import com.practice.moviewebsite.dto.ScreeningRequest;
import com.practice.moviewebsite.model.Screening;
import com.practice.moviewebsite.service.ScreeningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/screenings")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @GetMapping
    public List<Screening> getAllScreenings() {
        return screeningService.getAllScreenings();
    }

    @GetMapping("/{id}")
    public Screening getScreeningById(@PathVariable Long id) {
        return screeningService.getScreeningById(id);
    }

    @PostMapping
    public Screening addScreening(
            @RequestBody ScreeningRequest request
    ) {
        return screeningService.addScreening(request);
    }

    @PutMapping("/{id}")
    public Screening updateScreening(
            @PathVariable Long id,
            @RequestBody ScreeningRequest request
    ) {
        return screeningService.updateScreening(id, request);
    }

    @DeleteMapping("/{id}")
    public Screening deleteScreening(@PathVariable Long id) {
        return screeningService.deleteScreening(id);
    }
}
