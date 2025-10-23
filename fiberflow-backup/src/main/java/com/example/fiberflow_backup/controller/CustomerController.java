package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.CustomerOnboardingRequest;
import com.example.fiberflow_backup.dto.CustomerOnboardingResponse;
import com.example.fiberflow_backup.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/onboard")
    public ResponseEntity<?> onboardCustomer(@Valid @RequestBody CustomerOnboardingRequest request) {
        try {
            CustomerOnboardingResponse response = customerService.onboardCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Failed to onboard customer: " + e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(customerService.getCustomerById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    record ErrorResponse(String message) {}
}