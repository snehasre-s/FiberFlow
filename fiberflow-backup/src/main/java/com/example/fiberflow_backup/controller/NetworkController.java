package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.NetworkTopologyResponse;
import com.example.fiberflow_backup.service.NetworkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/network")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Network", description = "Network topology and management APIs")
public class NetworkController {

    private final NetworkService networkService;

    @GetMapping("/topology")
    @Operation(summary = "Get network topology", description = "Retrieve complete network hierarchy from Headend to Customers")
    public ResponseEntity<NetworkTopologyResponse> getNetworkTopology() {
        NetworkTopologyResponse topology = networkService.getNetworkTopology();
        return ResponseEntity.ok(topology);
    }
}
