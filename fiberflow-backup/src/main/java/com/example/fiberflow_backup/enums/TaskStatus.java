package com.example.fiberflow_backup.enums;

public enum TaskStatus {
    Scheduled("Scheduled"),
    InProgress("In Progress"),
    Completed("Completed"),
    Failed("Failed");

    private final String description;

    TaskStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
