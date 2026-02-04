package com.sheoran.repository;

import com.sheoran.model.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeCategoryRepo extends JpaRepository<HomeCategory,Long> {
}
