package com.sheoran.service;

import com.sheoran.domain.USER_ROLE;
import com.sheoran.request.LoginRequest;
import com.sheoran.response.AuthResponse;
import com.sheoran.response.SignupRequest;

public interface AuthService {

    void sendLoginOtp(String email, USER_ROLE role) throws Exception;

    String createUser(SignupRequest request) throws Exception;

    AuthResponse signing(LoginRequest req);

}
