package com.sheoran.repository;

import com.sheoran.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepo extends JpaRepository<Deal,Long> {
}
