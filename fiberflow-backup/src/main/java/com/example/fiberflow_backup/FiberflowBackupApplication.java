package com.example.fiberflow_backup;

import com.example.fiberflow_backup.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FiberflowBackupApplication {

	public static void main(String[] args) {
		SpringApplication.run(FiberflowBackupApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(AuthService authService) {
		return args -> {
			authService.createDemoData();  // Changed from createDemoUsers()
			System.out.println("✅ Demo data initialized!");
		};
	}
}
