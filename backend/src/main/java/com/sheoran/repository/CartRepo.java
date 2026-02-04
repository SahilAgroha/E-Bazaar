package com.sheoran.repository;

import com.sheoran.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepo extends JpaRepository<Cart,Long> {

    Cart findByUserId(Long id);
}
