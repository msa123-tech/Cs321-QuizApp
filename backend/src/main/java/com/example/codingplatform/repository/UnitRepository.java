package com.example.codingplatform.repository;

import com.example.codingplatform.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findAllByOrderByOrderIndexAsc();
}
