package com.sheoran.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String otp;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public LoginRequest() {
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LoginRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }
}
