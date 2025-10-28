package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.NetworkTopologyResponse.NetworkMetrics;
import com.example.fiberflow_backup.enums.CustomerStatus;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NetworkService {

    private final HeadendRepository headendRepository;
    private final FDHRepository fdhRepository;
    private final SplitterRepository splitterRepository;
    private final CustomerRepository customerRepository;

    public NetworkTopologyResponse getNetworkTopology() {
        // Get headend (assuming single headend for now)
        Headend headend = headendRepository.findAll().stream()
                .findFirst()
                .orElse(null);

        if (headend == null) {
            return null;
        }

        HeadendDTO headendDTO = convertToHeadendDTO(headend);

        // Get all FDHs
        List<FDHDTO> fdhList = fdhRepository.findAll().stream()
                .map(this::convertToFDHDTO)
                .collect(Collectors.toList());

        // Calculate metrics
        NetworkMetrics metrics = calculateNetworkMetrics();

        return new NetworkTopologyResponse(headendDTO, fdhList, metrics);
    }

    private HeadendDTO convertToHeadendDTO(Headend headend) {
        return new HeadendDTO(
                headend.getHeadendId(),
                headend.getName(),
                headend.getLocation(),
                headend.getRegion()
        );
    }

    private FDHDTO convertToFDHDTO(FDH fdh) {
        // Get all splitters for this FDH
        List<SplitterDTO> splitters = splitterRepository.findByFdh_FdhId(fdh.getFdhId())
                .stream()
                .map(this::convertToSplitterDTO)
                .collect(Collectors.toList());

        return new FDHDTO(
                fdh.getFdhId(),
                fdh.getName(),
                fdh.getLocation(),
                fdh.getRegion(),
                fdh.getMaxPorts(),
                splitters
        );
    }

    private SplitterDTO convertToSplitterDTO(Splitter splitter) {
        // Get all customers connected to this splitter
        List<CustomerInTopologyDTO> customers = customerRepository
                .findBySplitter_SplitterId(splitter.getSplitterId())
                .stream()
                .map(this::convertToCustomerInTopologyDTO)
                .collect(Collectors.toList());

        return new SplitterDTO(
                splitter.getSplitterId(),
                splitter.getModel(),
                splitter.getPortCapacity(),
                splitter.getUsedPorts(),
                splitter.getLocation(),
                customers
        );
    }

    private CustomerInTopologyDTO convertToCustomerInTopologyDTO(Customer customer) {
        return new CustomerInTopologyDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getPlan(),
                customer.getAssignedPort(),
                customer.getStatus().name()
        );
    }

    private NetworkMetrics calculateNetworkMetrics() {
        // Count total splitters
        int totalSplitters = (int) splitterRepository.count();

        // Calculate total ports and used ports
        List<Splitter> allSplitters = splitterRepository.findAll();
        int totalPorts = allSplitters.stream()
                .mapToInt(s -> s.getPortCapacity() != null ? s.getPortCapacity() : 0)
                .sum();
        int usedPorts = allSplitters.stream()
                .mapToInt(s -> s.getUsedPorts() != null ? s.getUsedPorts() : 0)
                .sum();

        // Count active customers
        int activeCustomers = (int) customerRepository.countByStatus(CustomerStatus.Active);

        return new NetworkMetrics(totalSplitters, totalPorts, usedPorts, activeCustomers);
    }
}
