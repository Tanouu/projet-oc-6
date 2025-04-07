package com.openclassrooms.mddapi;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.openclassrooms.mddapi")
public class MddApiApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.load();

		String jwtSecret = dotenv.get("JWT_SECRET");
		System.out.println("JWT_SECRET loaded? " + (jwtSecret != null && !jwtSecret.isEmpty()));
		System.setProperty("JWT_SECRET", jwtSecret);
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(MddApiApplication.class, args);
	}
}
