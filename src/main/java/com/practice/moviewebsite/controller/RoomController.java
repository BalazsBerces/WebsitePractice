package com.practice.moviewebsite.controller;

import com.practice.moviewebsite.model.Room;
import com.practice.moviewebsite.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService){
        this.roomService = roomService;
    }

    @GetMapping
    public List<Room> GetAllRooms(){
        return roomService.getAllRooms();
    }
    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable  Long id){
        return roomService.getRoomById(id);
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room){
        return roomService.addRoom(room);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room room){
        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    public Room deleteRoom(@PathVariable Long id){
        return roomService.deleteRoom(id);
    }
}
