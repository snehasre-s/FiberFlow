package com.example.fiberflow_backup.enums;

public enum AssetType {
    ONT("Optical Network Terminal"),
    Router("Network Router"),
    Splitter("Optical Splitter"),
    FDH("Fiber Distribution Hub"),
    Switch("Network Switch"),
    CPE("Customer Premises Equipment"),
    FiberRoll("Fiber Optic Cable Roll");

    private final String description;

    AssetType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
