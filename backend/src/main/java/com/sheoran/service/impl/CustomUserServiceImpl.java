package com.sheoran.service.impl;

import com.sheoran.domain.USER_ROLE;
import com.sheoran.model.Seller;
import com.sheoran.model.User;
import com.sheoran.repository.SellerRepo;
import com.sheoran.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SellerRepo sellerRepo;

    public UserRepo getUserRepo() {
        return userRepo;
    }

    public void setUserRepo(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public SellerRepo getSellerRepo() {
        return sellerRepo;
    }

    public void setSellerRepo(SellerRepo sellerRepo) {
        this.sellerRepo = sellerRepo;
    }

    private static final String SELLER_PREFIX="seller_";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.startsWith(SELLER_PREFIX)){
            String actualUsername=username.substring(SELLER_PREFIX.length());
            Seller seller=sellerRepo.findByEmail(actualUsername);
            if (seller!=null){
                return buildUserDetails(seller.getEmail(),seller.getPassword(),seller.getRole());
            }
        } else {
            User user=userRepo.findByEmail(username);

            if (user!=null){
                return buildUserDetails(user.getEmail(),user.getPassword(),user.getRole());
            }
        }
        throw new UsernameNotFoundException("user or seller not found with email "+username);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        System.out.println("enter buildUser function"+email+password+role);

        if (role==null) role=USER_ROLE.ROLE_CUSTOMER;

        List<GrantedAuthority> authorityList=new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));

        System.out.println("out of buildUser function"+authorityList);

        return new org.springframework.security.core.userdetails.User(email,password,authorityList);

    }
}
