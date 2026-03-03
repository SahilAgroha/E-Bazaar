package com.sheoran.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtTokenValidator.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7).trim(); // 🔥 IMPORTANT

        if (token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            SecretKey key =
                    Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes());

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.get("email", String.class);
            String authorities = claims.get("authorities", String.class);

            List<GrantedAuthority> auths =
                    AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(email, null, auths);

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {
            logger.error("Invalid JWT token: {}", e.getMessage());

            // 🔥 DO NOT THROW EXCEPTION
            // Just clear context and continue
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}