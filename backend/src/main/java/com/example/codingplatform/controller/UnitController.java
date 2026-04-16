package com.example.codingplatform.controller;

import com.example.codingplatform.entity.Unit;
import com.example.codingplatform.service.UnitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@CrossOrigin(origins = "http://localhost:3000")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public List<Unit> getAllUnits() {
        return unitService.getAllUnits();
    }

    @PostMapping
    public Unit createUnit(@RequestBody Unit unit) {
        return unitService.saveUnit(unit);
    }
}