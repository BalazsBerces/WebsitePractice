package com.practice.moviewebsite.service;

import com.practice.moviewebsite.model.Room;
import com.practice.moviewebsite.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    RoomService(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms(){
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id){
        return roomRepository.findById(id).orElse(null);
    }

    public Room addRoom(Room room){
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom){

        Room room = roomRepository.findById(id).orElse(null);

        if(room == null){
            return null;
        }

        room.setName(updatedRoom.getName());
        room.setCapacity(updatedRoom.getCapacity());

        return roomRepository.save(room);
    }

    public Room deleteRoom(Long id){
        Room room = roomRepository.findById(id).orElse(null);
        if(room == null){
            return null;
        }

        roomRepository.delete(room);
        return room;

    }
}
