package com.sheoran.repository;

import com.sheoran.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepo extends JpaRepository<WishList,Long> {

    WishList findByUserId(Long userId);
}
