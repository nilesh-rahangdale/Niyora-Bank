package com.niyora.EBankingSystem.Controllers.account;

import com.niyora.EBankingSystem.DTOs.account.AccCreateReq;
import com.niyora.EBankingSystem.DTOs.account.AccountDto;
import com.niyora.EBankingSystem.DTOs.account.CashDepositDto;
import com.niyora.EBankingSystem.DTOs.account.MoneyTransferDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionDto;
import com.niyora.EBankingSystem.DTOs.cheque.ChequeReqDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionRespDto;
import com.niyora.EBankingSystem.Services.account.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

// create account - only by CSO
    @PreAuthorize("hasRole('CSO')")
    @PostMapping("/create")
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccCreateReq accCreateReq, Authentication authentication) {
        if(authentication==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String csoMail= authentication.getName();
        AccountDto accountDto = accountService.createAccount(accCreateReq,csoMail);
        return ResponseEntity.ok(accountDto);
    }

//  get accounts for customer by customerId- by customer himself or by CSO
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('CSO') or hasRole('CUSTOMER') or hasRole('TELLER')")
    public ResponseEntity<List<AccountDto>> getAccountsByCustomerId(
            @PathVariable Long customerId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();
        boolean isCustomer = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_CUSTOMER"));

        // Customers can only access their own accounts
        if (isCustomer && !accountService.isAccountOwner(userEmail, customerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<AccountDto> accounts = accountService.getAccountsByCustomerId(customerId);
            if (accounts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    get accounts for customer by accountNumber- by customer himself or by CSO
    @GetMapping("/branchCode/{branchCode}")
    @PreAuthorize("hasRole('CSO') or hasRole('TELLER') or hasRole('MANAGER')")
    public ResponseEntity<List<AccountDto>> getAccountsByBranchCode(
            @PathVariable String branchCode,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();


        List<AccountDto> accounts = accountService.getAccountsByBranchCode(branchCode);
        return ResponseEntity.ok(accounts);
    }

//    GET ACCOUNTS FOR BRANCH BRANCH_CODE

    @GetMapping("/accountNumber/{accountNumber}")
    @PreAuthorize("hasRole('CSO') or hasRole('TELLER') or hasRole('MANAGER')")
    public ResponseEntity<AccountDto> getAccountsByAccountNumber(
            @PathVariable String accountNumber,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();
        boolean isCustomer = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_CUSTOMER"));

        if (isCustomer && !accountService.isAccountOwner(userEmail, accountNumber)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AccountDto account = accountService.getAccountByAccountNumber(accountNumber);
        return ResponseEntity.ok(account);
    }

//    Deposit Cash to account - by CSO
    @PostMapping("/cashDeposit")
    @PreAuthorize("hasRole('TELLER')")
    public ResponseEntity<AccountDto> depositCashToAccount(
            @RequestBody CashDepositDto cashDepositDto,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String tellerMail = authentication.getName();
        AccountDto updatedAccount = accountService.depositCashToAccount(cashDepositDto.getAccountNumber(), cashDepositDto.getAmount(), tellerMail);
        return ResponseEntity.ok(updatedAccount);
    }

//    Withdraw money from account - by CSO
    @PostMapping("/cashWithdraw")
    @PreAuthorize("hasRole('TELLER')")
    public ResponseEntity<AccountDto> withdrawCashFromAccount(
            @RequestBody CashDepositDto cashDepositDto,
            Authentication authentication) {
        if ( authentication == null ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String tellerMail = authentication.getName();
        AccountDto updatedAccount = accountService.withdrawCashFromAccount(cashDepositDto.getAccountNumber(), cashDepositDto.getAmount(), tellerMail);
        return ResponseEntity.ok(updatedAccount);
    }

//  Money transfer -Internal
    @PostMapping("/transfer/internal")
    @PreAuthorize("hasRole('TELLER')")
    public ResponseEntity<String> internalMoneyTransfer(
            @RequestBody MoneyTransferDto moneyTransferDto,
            Authentication authentication) {

        if ( authentication == null ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String tellerMail = authentication.getName();

        accountService.internalMoneyTransfer(moneyTransferDto,tellerMail);
        return ResponseEntity.ok("Transfer successful");
    }


//  Get all transactions of an account
    @GetMapping("/transactions/{accountNumber}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('CSO') or hasRole('CUSTOMER') or hasRole('TELLER')")
    public ResponseEntity<List<TransactionRespDto>> getTransactions(
            @PathVariable String accountNumber,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();
        boolean isCustomer = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_CUSTOMER"));

        if (isCustomer && !accountService.isAccountOwner(userEmail, accountNumber)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<TransactionRespDto> transactions = accountService.getTransactionsByAccountNumber(accountNumber);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//  Cheque deposit - by CSO / TELLER
    @PostMapping("/chequeDeposit")
    @PreAuthorize("hasRole('TELLER') or hasRole('CSO')")
    public ResponseEntity<String> chequeDeposit(
            @RequestBody ChequeReqDto chequeReqDto,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String tellerMail = authentication.getName();

        try {
            accountService.chequeDeposit(chequeReqDto, tellerMail);
            return ResponseEntity.ok("Cheque deposit successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}