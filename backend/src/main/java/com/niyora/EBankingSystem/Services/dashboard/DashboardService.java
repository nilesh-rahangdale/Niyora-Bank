package com.niyora.EBankingSystem.Services.dashboard;

import com.niyora.EBankingSystem.DTOs.cso.CsoDto;
import com.niyora.EBankingSystem.DTOs.teller.TellerDto;
import com.niyora.EBankingSystem.DTOs.dashboard.ManagerDashboardDto;
import com.niyora.EBankingSystem.DTOs.dashboard.AdminDashboardDto;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Entities.users.Manager;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.Teller;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Mappers.cso.CsoMapper;
import com.niyora.EBankingSystem.Mappers.teller.TellerMapper;
import com.niyora.EBankingSystem.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepo;
    private final BranchRepository branchRepo;
    private final ManagerRepository managerRepo;
    private final CSORepository csoRepo;
    private final TellerRepository tellerRepo;
    private final AccountRepository accountRepo;
    private final ComplaintRepository complaintRepo;
    private final TransactionRepository transactionRepo;
    private final CustomerRepository customerRepo;

    private final CsoMapper csoMapper;
    private final TellerMapper tellerMapper;

    public ManagerDashboardDto getManagerDashboard(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Manager manager = user.getManager();
        if (manager == null) {
            throw new RuntimeException("Logged in user is not registered as a Manager");
        }

        Branch branch = manager.getBranch();
        if (branch == null) {
            throw new RuntimeException("Manager is not assigned to any branch");
        }

        Long branchId = branch.getBranchId();

        // 1. Fetch CSOs and Tellers
        List<CsoDto> csos = csoRepo.findByBranchBranchId(branchId).stream()
                .map(csoMapper::toCsoDto)
                .collect(Collectors.toList());

        List<TellerDto> tellers = tellerRepo.findByBranchBranchId(branchId).stream()
                .map(tellerMapper::toTellerDto)
                .collect(Collectors.toList());

        // 2. Fetch Accounts
        List<Account> accounts = accountRepo.findAllByBranch(branch);
        Map<String, Long> accountsByType = accounts.stream()
                .collect(Collectors.groupingBy(acc -> acc.getAccountType() != null ? acc.getAccountType().name() : "UNKNOWN", Collectors.counting()));
        Map<String, Long> accountsByStatus = accounts.stream()
                .collect(Collectors.groupingBy(acc -> acc.getAccountStatus() != null ? acc.getAccountStatus().name() : "UNKNOWN", Collectors.counting()));

        // 3. Fetch Complaints
        List<Complaint> complaints = complaintRepo.findByBranchBranchId(branchId);
        int totalComplaints = complaints.size();
        int pending = 0, resolved = 0, rejected = 0;
        for (Complaint c : complaints) {
            if (c.getStatus() == Complaint.Status.PENDING) pending++;
            else if (c.getStatus() == Complaint.Status.RESOLVED) resolved++;
            else if (c.getStatus() == Complaint.Status.REJECTED) rejected++;
        }

        // 4. Fetch and Aggregate Cash Flow (only successful transactions)
        List<Transaction> transactions = transactionRepo.findByAccountBranchBranchIdAndStatus(branchId, Transaction.Status.SUCCESS);
        double totalCashDeposit = 0.0;
        double totalCashWithdrawal = 0.0;
        double totalChequeDeposit = 0.0;
        double totalChequeWithdrawal = 0.0;
        double totalTransferDebit = 0.0;
        double totalTransferCredit = 0.0;

        for (Transaction t : transactions) {
            switch (t.getTransactionType()) {
                case CASH_DEPOSIT:
                    totalCashDeposit += t.getAmount();
                    break;
                case WITHDRAWAL:
                    totalCashWithdrawal += t.getAmount();
                    break;
                case CHEQUE_DEPOSIT:
                    totalChequeDeposit += t.getAmount();
                    break;
                case CHEQUE_WITHDRAWAL:
                    totalChequeWithdrawal += t.getAmount();
                    break;
                case INTERNAL_TRANSFER_DEBIT:
                    totalTransferDebit += t.getAmount();
                    break;
                case INTERNAL_TRANSFER_CREDIT:
                    totalTransferCredit += t.getAmount();
                    break;
            }
        }

        return ManagerDashboardDto.builder()
                .branchId(branchId)
                .branchName(branch.getBranchName())
                .branchIfsc(branch.getBranchIfsc())
                .csos(csos)
                .tellers(tellers)
                .totalCsos(csos.size())
                .totalTellers(tellers.size())
                .totalCashDeposit(totalCashDeposit)
                .totalCashWithdrawal(totalCashWithdrawal)
                .totalChequeDeposit(totalChequeDeposit)
                .totalChequeWithdrawal(totalChequeWithdrawal)
                .totalTransferDebit(totalTransferDebit)
                .totalTransferCredit(totalTransferCredit)
                .totalComplaints(totalComplaints)
                .pendingComplaints(pending)
                .resolvedComplaints(resolved)
                .rejectedComplaints(rejected)
                .totalAccounts(accounts.size())
                .accountsByType(accountsByType)
                .accountsByStatus(accountsByStatus)
                .build();
    }

    public AdminDashboardDto getAdminDashboard() {
        List<User> allUsers = userRepo.findAll();

        Map<String, Long> usersByStatus = allUsers.stream()
                .collect(Collectors.groupingBy(u -> u.getStatus() != null ? u.getStatus().name() : "UNKNOWN", Collectors.counting()));

        Map<String, Long> usersByRole = allUsers.stream()
                .flatMap(u -> u.getRoles().stream())
                .collect(Collectors.groupingBy(role -> role, Collectors.counting()));

        long totalBranches = branchRepo.count();
        long totalManagers = managerRepo.count();
        long totalTellers = tellerRepo.count();
        long totalCsos = csoRepo.count();
        long totalCustomers = customerRepo.count();

        return AdminDashboardDto.builder()
                .totalUsers(allUsers.size())
                .usersByRole(usersByRole)
                .usersByStatus(usersByStatus)
                .totalBranches(totalBranches)
                .totalManagers(totalManagers)
                .totalTellers(totalTellers)
                .totalCsos(totalCsos)
                .totalCustomers(totalCustomers)
                .build();
    }
}
