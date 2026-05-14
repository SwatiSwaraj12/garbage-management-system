package com.garbage.repository;

import com.garbage.model.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * WasteTypeRepository: Data access for waste type categories.
 */
@Repository
public interface WasteTypeRepository extends JpaRepository<WasteType, Long> {

    // Get only active waste types (shown in user request form dropdown)
    List<WasteType> findByActive(Boolean isActive);

    // Check if a waste type name already exists
    boolean existsByName(String name);
}
