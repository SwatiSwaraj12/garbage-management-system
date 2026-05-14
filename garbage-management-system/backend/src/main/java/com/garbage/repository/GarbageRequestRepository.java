package com.garbage.repository;

import com.garbage.model.GarbageRequest;
import com.garbage.model.GarbageRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * GarbageRequestRepository: Spring Data JPA for garbage request queries.
 */
@Repository
public interface GarbageRequestRepository extends JpaRepository<GarbageRequest, Long> {

    // Get all requests by a specific user (for user dashboard)
    List<GarbageRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get all requests with a specific status (for admin filtering)
    List<GarbageRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    // Get all requests ordered by newest first (for admin view)
    List<GarbageRequest> findAllByOrderByCreatedAtDesc();

    // Count requests by status (for admin stats)
    long countByStatus(RequestStatus status);

    // Count all requests by a specific user
    long countByUserId(Long userId);

    // Custom query: get requests by user and status
    List<GarbageRequest> findByUserIdAndStatus(Long userId, RequestStatus status);

    // Find requests by waste type
    List<GarbageRequest> findByWasteTypeId(Long wasteTypeId);

    // Admin stats: count by waste type using JPQL
    @Query("SELECT r.wasteType.name, COUNT(r) FROM GarbageRequest r GROUP BY r.wasteType.name")
    List<Object[]> countByWasteType();
}
