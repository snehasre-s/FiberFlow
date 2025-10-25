package com.example.fiberflow_backup.enums;

public enum UserRole {
    Admin("System Administrator"),
    Planner("Network Planner"),
    Technician("Field Technician"),
    SupportAgent("Customer Support Agent"),
    FieldEngineer("Field Engineer / Sales Agent"),
    DeploymentLead("Deployment Lead");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
