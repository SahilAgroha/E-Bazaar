package com.sheoran;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BuyBaazarApplication {

	public static void main(String[] args) {
		SpringApplication.run(BuyBaazarApplication.class, args);
	}

}
