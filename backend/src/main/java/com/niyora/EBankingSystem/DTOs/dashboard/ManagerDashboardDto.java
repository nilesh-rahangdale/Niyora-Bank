package com.niyora.EBankingSystem.DTOs.dashboard;

import com.niyora.EBankingSystem.DTOs.cso.CsoDto;
import com.niyora.EBankingSystem.DTOs.teller.TellerDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ManagerDashboardDto {
    private Long branchId;
    private String branchName;
    private String branchIfsc;

    // Staff lists
    private List<CsoDto> csos;
    private List<TellerDto> tellers;
    private int totalCsos;
    private int totalTellers;

    // Cash flow analytics
    private Double totalCashDeposit;
    private Double totalCashWithdrawal;
    private Double totalChequeDeposit;
    private Double totalChequeWithdrawal;
    private Double totalTransferDebit;
    private Double totalTransferCredit;

    // Complaints counts
    private int totalComplaints;
    private int pendingComplaints;
    private int resolvedComplaints;
    private int rejectedComplaints;

    // Bank accounts count
    private int totalAccounts;
    private Map<String, Long> accountsByType;
    private Map<String, Long> accountsByStatus;
}
