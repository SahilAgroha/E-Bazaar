package com.sheoran.repository;

import com.sheoran.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category,Long> {

    Category findByCategoryId(String categoryId);
}
