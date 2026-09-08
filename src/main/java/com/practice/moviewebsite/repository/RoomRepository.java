package com.practice.moviewebsite.repository;

import com.practice.moviewebsite.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
