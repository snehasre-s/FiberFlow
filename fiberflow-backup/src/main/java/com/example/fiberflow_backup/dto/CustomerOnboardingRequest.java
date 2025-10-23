package com.example.fiberflow_backup.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOnboardingRequest {

    // Step 1: Customer Details
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^\\d{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    @NotBlank(message = "Service plan is required")
    private String servicePlan;

    // Step 2: Deployment Zone
    @NotBlank(message = "Deployment zone is required")
    private String deploymentZone;

    @NotBlank(message = "FDH location is required")
    private String fdhLocation;

    @NotBlank(message = "Splitter port is required")
    private String splitterPort;

    // Step 3: Device Allocation
    @NotBlank(message = "ONT serial number is required")
    private String ontSerialNumber;

    @NotBlank(message = "Router serial number is required")
    private String routerSerialNumber;

    @NotBlank(message = "Cable length is required")
    private String cableLength;

    // Step 4: Installation
    @NotBlank(message = "Installation date is required")
    private String installationDate;

    @NotBlank(message = "Technician assignment is required")
    private String technician;

    private String notes;
}
