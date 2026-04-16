package com.example.codingplatform.service;

import com.example.codingplatform.entity.Unit;
import com.example.codingplatform.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> getAllUnits() {
        return unitRepository.findAllByOrderByOrderIndexAsc();
    }

    public Unit saveUnit(Unit unit) {
        return unitRepository.save(unit);
    }
}