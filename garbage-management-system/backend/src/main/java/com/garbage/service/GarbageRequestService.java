package com.garbage.service;

import com.garbage.model.GarbageRequest;
import com.garbage.model.GarbageRequest.RequestStatus;
import com.garbage.model.User;
import com.garbage.model.WasteType;
import com.garbage.repository.GarbageRequestRepository;
import com.garbage.repository.UserRepository;
import com.garbage.repository.WasteTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

/**
 * GarbageRequestService: Core business logic for garbage collection requests.
 * Handles creation, retrieval, status updates, and admin assignment.
 */
@Service
public class GarbageRequestService {

    @Autowired
    private GarbageRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WasteTypeRepository wasteTypeRepository;

    // ─────────────────────────────
    // USER OPERATIONS
    // ─────────────────────────────

    /**
     * Create a new garbage pickup request.
     */
    public Map<String, Object> createRequest(Long userId, Long wasteTypeId,
                                              String pickupAddress, LocalDate scheduledDate,
                                              String notes) {
        Map<String, Object> response = new HashMap<>();

        // Fetch the user and waste type
        User user = userRepository.findById(userId).orElse(null);
        WasteType wasteType = wasteTypeRepository.findById(wasteTypeId).orElse(null);

        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found.");
            return response;
        }

        if (wasteType == null) {
            response.put("success", false);
            response.put("message", "Waste type not found.");
            return response;
        }

        // Create and save the request
        GarbageRequest request = new GarbageRequest();
        request.setUser(user);
        request.setWasteType(wasteType);
        request.setPickupAddress(pickupAddress);
        request.setScheduledDate(scheduledDate);
        request.setNotes(notes);
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(java.time.LocalDateTime.now());
        request.setUpdatedAt(java.time.LocalDateTime.now());


        requestRepository.save(request);

        response.put("success", true);
        response.put("message", "Garbage collection request submitted successfully!");
        response.put("requestId", request.getId());
        return response;
    }

    /**
     * Get all requests for a specific user (for user dashboard).
     */
    public List<Map<String, Object>> getUserRequests(Long userId) {
        List<GarbageRequest> requests = requestRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return convertToResponseList(requests);
    }

    // ─────────────────────────────
    // ADMIN OPERATIONS
    // ─────────────────────────────

    /**
     * Get ALL requests (admin view).
     */
    public List<Map<String, Object>> getAllRequests() {
        List<GarbageRequest> requests = requestRepository.findAllByOrderByCreatedAtDesc();
        return convertToResponseList(requests);
    }

    /**
     * Update request status (admin action).
     */
    public Map<String, Object> updateStatus(Long requestId, RequestStatus status,
                                             String collectorName, String routeInfo,
                                             LocalDate collectionDate) {
        Map<String, Object> response = new HashMap<>();

        GarbageRequest request = requestRepository.findById(requestId).orElse(null);
        if (request == null) {
            response.put("success", false);
            response.put("message", "Request not found.");
            return response;
        }

        request.setStatus(status);
        if (collectorName != null) request.setCollectorName(collectorName);
        if (routeInfo != null) request.setRouteInfo(routeInfo);
        if (collectionDate != null) request.setCollectionDate(collectionDate);

        requestRepository.save(request);

        response.put("success", true);
        response.put("message", "Request updated successfully.");
        return response;
    }

    /**
     * Get statistics for admin dashboard.
     */
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", requestRepository.count());
        stats.put("pending", requestRepository.countByStatus(RequestStatus.PENDING));
        stats.put("inProgress", requestRepository.countByStatus(RequestStatus.IN_PROGRESS));
        stats.put("completed", requestRepository.countByStatus(RequestStatus.COMPLETED));
        stats.put("cancelled", requestRepository.countByStatus(RequestStatus.CANCELLED));

        // Waste type breakdown
        List<Object[]> wasteStats = requestRepository.countByWasteType();
        Map<String, Long> wasteBreakdown = new HashMap<>();
        for (Object[] row : wasteStats) {
            wasteBreakdown.put((String) row[0], (Long) row[1]);
        }
        stats.put("wasteBreakdown", wasteBreakdown);

        return stats;
    }

    /**
     * Get a single request by ID.
     */
    public Map<String, Object> getRequestById(Long id) {
        GarbageRequest request = requestRepository.findById(id).orElse(null);
        if (request == null) return null;
        return convertToResponse(request);
    }

    // ─────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────

    /**
     * Convert GarbageRequest entity to a clean Map (for JSON response).
     * Avoids circular references from Lazy loading.
     */
    private Map<String, Object> convertToResponse(GarbageRequest req) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", req.getId());
        map.put("status", req.getStatus().name());
        map.put("pickupAddress", req.getPickupAddress());
        map.put("scheduledDate", req.getScheduledDate());
        map.put("collectionDate", req.getCollectionDate());
        map.put("collectorName", req.getCollectorName());
        map.put("routeInfo", req.getRouteInfo());
        map.put("notes", req.getNotes());
        map.put("createdAt", req.getCreatedAt());
        map.put("updatedAt", req.getUpdatedAt());

        // Nested: user info
        if (req.getUser() != null) {
            map.put("userName", req.getUser().getName());
            map.put("userEmail", req.getUser().getEmail());
            map.put("userId", req.getUser().getId());
        }

        // Nested: waste type info
        if (req.getWasteType() != null) {
            map.put("wasteTypeName", req.getWasteType().getName());
            map.put("wasteTypeColor", req.getWasteType().getColor());
            map.put("wasteTypeIcon", req.getWasteType().getIcon());
            map.put("wasteTypeId", req.getWasteType().getId());
        }

        return map;
    }

    private List<Map<String, Object>> convertToResponseList(List<GarbageRequest> requests) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (GarbageRequest req : requests) {
            result.add(convertToResponse(req));
        }
        return result;
    }
}
