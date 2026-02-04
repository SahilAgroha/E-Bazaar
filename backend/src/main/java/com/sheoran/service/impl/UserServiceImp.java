package com.sheoran.service.impl;

import com.sheoran.config.JwtProvider;
import com.sheoran.model.User;
import com.sheoran.repository.UserRepo;
import com.sheoran.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email=jwtProvider.getEmailFromJwtToken(jwt);

        return this.findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepo.findByEmail(email);

        if (user==null){
            throw new Exception("user not fount with email - "+email);
        }

        return user;
    }
}
