package com.sheoran.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ApiResponse {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
