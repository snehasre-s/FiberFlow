package com.example.fiberflow_backup.enums;

public enum CustomerStatus {
    Active("Active Service"),
    Inactive("Inactive/Disconnected"),
    Pending("Pending Activation");

    private final String description;

    CustomerStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
