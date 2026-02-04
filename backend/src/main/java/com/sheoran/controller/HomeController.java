package com.sheoran.controller;

import com.sheoran.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse home(){
        ApiResponse apiResponse=new ApiResponse();
        apiResponse.setMessage("Hello...");
        return apiResponse;
    }
}
