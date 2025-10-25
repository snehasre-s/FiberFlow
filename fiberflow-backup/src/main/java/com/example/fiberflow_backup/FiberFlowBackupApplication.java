package com.example.fiberflow_backup;

import com.example.fiberflow_backup.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FiberFlowBackupApplication {

	public static void main(String[] args) {
		SpringApplication.run(FiberFlowBackupApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(AuthService authService) {
		return args -> {
			authService.initializeDemoData();
			System.out.println("✅ Demo data initialized successfully!");
		};
	}
}
