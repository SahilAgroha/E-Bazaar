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
    public void sendLoginOtp(String email,USER_ROLE role) throws Exception {
        String SIGNING_PREFIX="signing_";
//        String SELLER_PREFIX="seller_";

        if(email.startsWith(SIGNING_PREFIX)) {

            email = email.substring(SIGNING_PREFIX.length());
            if (role.equals(USER_ROLE.ROLE_SELLER)){
                Seller seller=sellerRepo.findByEmail(email);
                if (seller==null){
                    throw new Exception("seller not exist with provided email "+email);
                }

            } else {
                User user = userRepo.findByEmail(email);
                if (user == null) {
                    throw new Exception("User not exist with provided email "+email);
                }
            }



        }

            VerificationCode isExist=verificationCodeRepo.findByEmail(email);
            if(isExist!=null){
                verificationCodeRepo.delete(isExist);
            }
            String otp= OtpUtil.generateOtp();

            VerificationCode verificationCode=new VerificationCode();
            verificationCode.setOtp(otp);
            verificationCode.setEmail(email);
            verificationCodeRepo.save(verificationCode);

            String subject="buyBaazar loginin/signup otp";
            String text="your login/signup otp is -"+otp;

            emailService.sendVerificationOtpEmail(email,otp,subject,text);


    }

    @Override
    public String createUser(SignupRequest request) throws Exception {

        VerificationCode verificationCode=verificationCodeRepo.findByEmail(request.getEmail());

        if(verificationCode==null || !verificationCode.getOtp().equals(request.getOtp())){
            throw new Exception("wrong otp....");
        }

        User user =userRepo.findByEmail(request.getEmail());

        if(user==null){
            User createdUser=new User();
            createdUser.setEmail(request.getEmail());
            createdUser.setFullName(request.getFullName());
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("9812591172");
            createdUser.setPassword(passwordEncoder.encode(request.getOtp()));

            user=userRepo.save(createdUser);

            Cart cart=new Cart();
            cart.setUser(user);
            cartRepo.save(cart);
        }

        List<GrantedAuthority> authorities=new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication=new UsernamePasswordAuthenticationToken(request.getEmail(),null,authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest req) {

        String username=req.getEmail();
        String otp=req.getOtp();


        Authentication authentication=authenticate(username,otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token=jwtProvider.generateToken(authentication);
        System.out.println("jwt "+token);

        AuthResponse authResponse=new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login success");

        Collection<? extends GrantedAuthority> authorities=authentication.getAuthorities();
        String roleName=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();


        authResponse.setRole(USER_ROLE.valueOf(roleName));



        return authResponse;
    }

    private Authentication authenticate(String username, String otp) {

        UserDetails userDetails=customUserService.loadUserByUsername(username);

        String SELLER_PREFIX="seller_";
        if (username.startsWith(SELLER_PREFIX)){
            username=username.substring(SELLER_PREFIX.length());
        }

        if (userDetails==null){
            throw new BadCredentialsException("invalid username");
        }
        VerificationCode verificationCode=verificationCodeRepo.findByEmail(username);
        System.out.println("verification Code "+verificationCode);

        if (verificationCode==null || !verificationCode.getOtp().equals(otp)){
            throw new BadCredentialsException("wrong otp");
        }


        return new UsernamePasswordAuthenticationToken(username,null,userDetails.getAuthorities());
    }
}
