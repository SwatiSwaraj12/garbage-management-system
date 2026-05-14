package com.garbage.controller;

import com.garbage.model.GarbageRequest.RequestStatus;
import com.garbage.service.GarbageRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * GarbageRequestController: REST endpoints for garbage collection requests.
 *
 * Base URL: /api/requests
 */
@RestController
@RequestMapping("/api/requests")
public class GarbageRequestController {

    @Autowired
    private GarbageRequestService requestService;

    // ─────────────────────────────────────────
    // USER ENDPOINTS
    // ─────────────────────────────────────────

    /**
     * POST /api/requests/create
     * Submit a new garbage pickup request.
     * Accessible by: USER, ADMIN
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long wasteTypeId = Long.valueOf(body.get("wasteTypeId").toString());
        String pickupAddress = (String) body.get("pickupAddress");
        LocalDate scheduledDate = LocalDate.parse((String) body.get("scheduledDate"));
        String notes = (String) body.getOrDefault("notes", "");

        Map<String, Object> response = requestService.createRequest(
            userId, wasteTypeId, pickupAddress, scheduledDate, notes);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/requests/user/{userId}
     * Get all requests submitted by a specific user.
     * Accessible by: USER (their own), ADMIN (any)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(requestService.getUserRequests(userId));
    }

    /**
     * GET /api/requests/{id}
     * Get a specific request by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        Map<String, Object> request = requestService.getRequestById(id);
        if (request == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(request);
    }

    // ─────────────────────────────────────────
    // ADMIN ENDPOINTS
    // ─────────────────────────────────────────

    /**
     * GET /api/requests/admin/all
     * Get all requests (Admin dashboard view).
     * Accessible by: ADMIN only
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    /**
     * PUT /api/requests/admin/update/{id}
     * Update a request's status and assign collector.
     * Accessible by: ADMIN only
     *
     * Request body:
     * {
     *   "status": "IN_PROGRESS",
     *   "collectorName": "Ramesh Kumar",
     *   "routeInfo": "Zone B - Route 5",
     *   "collectionDate": "2024-12-25"
     * }
     */
    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        RequestStatus status = RequestStatus.valueOf((String) body.get("status"));
        String collectorName = (String) body.get("collectorName");
        String routeInfo = (String) body.get("routeInfo");
        LocalDate collectionDate = body.get("collectionDate") != null
            ? LocalDate.parse((String) body.get("collectionDate"))
            : null;

        Map<String, Object> response = requestService.updateStatus(
            id, status, collectorName, routeInfo, collectionDate);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/requests/admin/stats
     * Get statistics for admin dashboard (counts by status).
     * Accessible by: ADMIN only
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(requestService.getAdminStats());
    }
}
