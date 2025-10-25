package com.example.fiberflow_backup.enums;

public enum ConnectionType {
    Wired("Wired Connection"),
    Wireless("Wireless Connection");

    private final String description;

    ConnectionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}