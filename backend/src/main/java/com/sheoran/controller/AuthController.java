package com.sheoran.controller;

import com.sheoran.domain.USER_ROLE;
import com.sheoran.model.User;
import com.sheoran.model.VerificationCode;
import com.sheoran.repository.UserRepo;
import com.sheoran.request.LoginOtpRequest;
import com.sheoran.request.LoginRequest;
import com.sheoran.response.ApiResponse;
import com.sheoran.response.AuthResponse;
import com.sheoran.response.SignupRequest;
import com.sheoran.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest request) throws Exception {

        String jwt = authService.createUser(request);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("register success");
        res.setRole(USER_ROLE.ROLE_CUSTOMER);


        return ResponseEntity.ok(res);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {

        authService.sendLoginOtp(req.getEmail(),req.getRole());

        ApiResponse response = new ApiResponse();

        response.setMessage("otp sent successfully");

        return ResponseEntity.ok(response);


    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request){
        System.out.println("Controller  "+request);

        AuthResponse authResponse=authService.signing(request);

        System.out.println("End of Controller");
        return ResponseEntity.ok(authResponse);
    }

}
