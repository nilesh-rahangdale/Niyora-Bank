package com.niyora.EBankingSystem.Controllers.MobileApis.account;

import com.niyora.EBankingSystem.DTOs.account.AccountDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionRespDto;
import com.niyora.EBankingSystem.Services.customer.MobileCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mobile/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class MobileAccountController {

    private final MobileCustomerService mobileCustomerService;

    /**
     * GET /api/mobile/accounts
     * Returns all accounts linked to the authenticated customer.
     */
    @GetMapping
    public ResponseEntity<List<AccountDto>> getMyAccounts(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<AccountDto> accounts = mobileCustomerService.getMyAccounts(authentication.getName());
        return ResponseEntity.ok(accounts);
    }

    /**
     * GET /api/mobile/accounts/{accountNumber}/balance
     * Returns the balance and details of a specific account owned by the customer.
     */
    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<AccountDto> getAccountBalance(
            @PathVariable String accountNumber,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AccountDto account = mobileCustomerService.getAccountBalance(authentication.getName(), accountNumber);
        return ResponseEntity.ok(account);
    }

    /**
     * GET /api/mobile/accounts/{accountNumber}/transactions
     * Returns the full transaction history for a specific account owned by the customer.
     */
    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionRespDto>> getAccountTransactions(
            @PathVariable String accountNumber,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<TransactionRespDto> transactions = mobileCustomerService.getAccountTransactions(authentication.getName(), accountNumber);
        return ResponseEntity.ok(transactions);
    }
}
