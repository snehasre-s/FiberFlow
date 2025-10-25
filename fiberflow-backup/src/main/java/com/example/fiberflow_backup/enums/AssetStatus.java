package com.example.fiberflow_backup.enums;

public enum AssetStatus {
    Available("Available for deployment"),
    Assigned("Assigned to customer"),
    Faulty("Faulty/Defective"),
    Retired("Retired from service");

    private final String description;

    AssetStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
