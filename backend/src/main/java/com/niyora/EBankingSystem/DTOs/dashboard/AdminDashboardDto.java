package com.niyora.EBankingSystem.DTOs.dashboard;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AdminDashboardDto {
    private long totalUsers;
    private Map<String, Long> usersByRole;
    private Map<String, Long> usersByStatus;

    private long totalBranches;
    private long totalManagers;
    private long totalTellers;
    private long totalCsos;
    private long totalCustomers;
}
