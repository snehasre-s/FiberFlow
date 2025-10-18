package com.example.fiberflow_backend.controllers;

import com.example.fiberflow_backend.entities.Asset;
import com.example.fiberflow_backend.repositories.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin("http://localhost:5173")
public class AssetController {
    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public List<Asset> getAllAssets(){
        return assetRepository.findAll();
    }

    @PostMapping
    public Asset addAsset(@RequestBody Asset asset){
        return assetRepository.save(asset);
    }
}
