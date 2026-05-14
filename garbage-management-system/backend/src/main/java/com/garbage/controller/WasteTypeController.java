package com.garbage.controller;

import com.garbage.model.WasteType;
import com.garbage.repository.WasteTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * WasteTypeController: REST endpoints for waste type management.
 * GET /api/waste-types       → Public (used in request form dropdown)
 * POST /api/waste-types      → Admin only (add new waste type)
 * PUT /api/waste-types/{id}  → Admin only (edit)
 */
@RestController
@RequestMapping("/api/waste-types")
public class WasteTypeController {

    @Autowired
    private WasteTypeRepository wasteTypeRepository;

    /** GET all active waste types - PUBLIC */
    @GetMapping
    public ResponseEntity<List<WasteType>> getActiveWasteTypes() {
        return ResponseEntity.ok(wasteTypeRepository.findByActive(true));
    }

    /** GET all waste types including inactive - ADMIN only */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WasteType>> getAllWasteTypes() {
        return ResponseEntity.ok(wasteTypeRepository.findAll());
    }

    /** POST create new waste type - ADMIN only */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createWasteType(@RequestBody WasteType wasteType) {
        if (wasteTypeRepository.existsByName(wasteType.getName())) {
            return ResponseEntity.badRequest().body("Waste type with this name already exists");
        }
        return ResponseEntity.ok(wasteTypeRepository.save(wasteType));
    }

    /** PUT toggle active/inactive - ADMIN only */
    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleWasteType(@PathVariable Long id) {
        WasteType wt = wasteTypeRepository.findById(id).orElse(null);
        if (wt == null) return ResponseEntity.notFound().build();
        wt.setActive(!wt.getActive());
        return ResponseEntity.ok(wasteTypeRepository.save(wt));
    }
}
