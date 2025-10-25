package com.example.fiberflow_backup.enums;

public enum LineStatus {
    Active("Active Connection"),
    Disconnected("Disconnected");

    private final String description;

    LineStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
