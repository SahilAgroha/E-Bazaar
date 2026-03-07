package com.sheoran.service.impl;

import com.sheoran.config.JwtProvider;
import com.sheoran.domain.USER_ROLE;
import com.sheoran.model.Cart;
import com.sheoran.model.Seller;
import com.sheoran.model.User;
import com.sheoran.model.VerificationCode;
import com.sheoran.repository.CartRepo;
import com.sheoran.repository.SellerRepo;
import com.sheoran.repository.UserRepo;
import com.sheoran.repository.VerificationCodeRepo;
import com.sheoran.request.LoginRequest;
import com.sheoran.response.AuthResponse;
import com.sheoran.response.SignupRequest;
import com.sheoran.service.AuthService;
import com.sheoran.service.EmailService;
import com.sheoran.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private VerificationCodeRepo verificationCodeRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CustomUserServiceImpl customUserService;

    @Autowired
    private SellerRepo sellerRepo;

    @Override
    public void sendLoginOtp(String email, USER_ROLE role) throws Exception {
        String SIGNING_PREFIX = "signing_";

        if (email.startsWith(SIGNING_PREFIX)) {
            email = email.substring(SIGNING_PREFIX.length());
            if (role.equals(USER_ROLE.ROLE_SELLER)) {
                Seller seller = sellerRepo.findByEmail(email);
                if (seller == null) {
                    throw new Exception("seller not exist with provided email " + email);
                }
            } else {
                User user = userRepo.findByEmail(email);
                if (user == null) {
                    throw new Exception("User not exist with provided email " + email);
                }
            }
        }

        VerificationCode isExist = verificationCodeRepo.findByEmail(email);
        if (isExist != null) {
            verificationCodeRepo.delete(isExist);
        }

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCode.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        verificationCodeRepo.save(verificationCode);

        String subject = "Your buyBaazar Verification Code";

        // Stylish HTML Content
        String htmlText = "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>" +
                "<div style='max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);'>" +
                "<h2 style='color: #2563eb; text-align: center;'>buyBaazar</h2>" +
                "<p style='font-size: 16px; color: #333;'>Hello,</p>" +
                "<p style='font-size: 16px; color: #333;'>You are trying to login or signup. Use the following OTP to complete your verification. This code is valid for <b>5 minutes</b>.</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<span style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; border: 2px dashed #2563eb; padding: 10px 20px; border-radius: 5px; background-color: #f0f7ff;'>" +
                otp + "</span>" +
                "</div>" +
                "<p style='font-size: 14px; color: #666; text-align: center;'>If you did not request this, please ignore this email.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='font-size: 12px; color: #aaa; text-align: center;'>&copy; 2026 buyBaazar Team. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>";

        emailService.sendVerificationOtpEmail(email, otp, subject, htmlText);
    }

    @Override
    public String createUser(SignupRequest request) throws Exception {
        VerificationCode verificationCode = verificationCodeRepo.findByEmail(request.getEmail());

        if (verificationCode == null || !verificationCode.getOtp().equals(request.getOtp())) {
            throw new Exception("wrong otp....");
        }

        User user = userRepo.findByEmail(request.getEmail());

        if (user == null) {
            User createdUser = new User();
            createdUser.setEmail(request.getEmail());
            createdUser.setFullName(request.getFullName());

            if (request.getEmail().equals("sahilsheo444@gmail.com")) {
                createdUser.setRole(USER_ROLE.ROLE_ADMIN);
            } else {
                createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            }

            createdUser.setMobile("9812591172");
            createdUser.setPassword(passwordEncoder.encode(request.getOtp()));

            user = userRepo.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cart.setTotalMrpPrice(BigDecimal.ZERO);
            cart.setTotalSellingPrice(BigDecimal.ZERO);
            cart.setTotalItem(0);
            cart.setDiscount(0);

            cartRepo.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest req) {
        String username = req.getEmail();
        String otp = req.getOtp();

        Authentication authentication = authenticate(username, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login success");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        authResponse.setRole(USER_ROLE.valueOf(roleName));
        return authResponse;
    }

    private Authentication authenticate(String username, String otp) {
        UserDetails userDetails = customUserService.loadUserByUsername(username);

        String SELLER_PREFIX = "seller_";
        String actualUsername = username;
        if (actualUsername.startsWith(SELLER_PREFIX)) {
            actualUsername = actualUsername.substring(SELLER_PREFIX.length());
        }

        if (userDetails == null) {
            throw new BadCredentialsException("invalid username");
        }

        VerificationCode verificationCode = verificationCodeRepo.findByEmail(actualUsername);

        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new BadCredentialsException("wrong otp");
        }

        return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
    }
}