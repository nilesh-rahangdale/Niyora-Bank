package com.niyora.EBankingSystem.Services.customer;

import com.niyora.EBankingSystem.DTOs.account.AccountDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionRespDto;
import com.niyora.EBankingSystem.DTOs.customer.CustomerDto;
import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.account.AccountMapper;
import com.niyora.EBankingSystem.Mappers.customer.CustomerMapper;
import com.niyora.EBankingSystem.Repositories.AccountRepository;
import com.niyora.EBankingSystem.Repositories.CustomerRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MobileCustomerService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final CustomerMapper customerMapper;
    private final AccountMapper accountMapper;

    /**
     * Returns the full profile of the authenticated customer.
     */
    public CustomerDto getMyProfile(String email) {
        Customer customer = resolveCustomerByEmail(email);
        return customerMapper.toCustomerDto(customer);
    }

    /**
     * Returns all accounts belonging to the authenticated customer.
     */
    public List<AccountDto> getMyAccounts(String email) {
        Customer customer = resolveCustomerByEmail(email);
        List<Account> accounts = accountRepository.findAllByCustomer(customer);
        return accountMapper.toAccountDtoList(accounts);
    }

    /**
     * Returns account details (including balance) for a specific account,
     * after verifying ownership.
     */
    public AccountDto getAccountBalance(String email, String accountNumber) {
        Customer customer = resolveCustomerByEmail(email);
        Account account = resolveAccountAndVerifyOwnership(accountNumber, customer);
        return accountMapper.toAccountDto(account);
    }

    /**
     * Returns the transaction history for a specific account,
     * after verifying ownership.
     */
    public List<TransactionRespDto> getAccountTransactions(String email, String accountNumber) {
        Customer customer = resolveCustomerByEmail(email);
        Account account = resolveAccountAndVerifyOwnership(accountNumber, customer);

        return account.getTransactions().stream()
                .map(t -> TransactionRespDto.builder()
                        .transactionType(t.getTransactionType())
                        .amount(t.getAmount())
                        .transactionDate(t.getTransactionDate())
                        .status(t.getStatus())
                        .processedById(t.getProcessedBy() != null ? t.getProcessedBy().getId() : null)
                        .remarks(t.getRemarks())
                        .build())
                .toList();
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────────

    private Customer resolveCustomerByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + email));
        return customerRepository.findByCustomerId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer profile not found for: " + email));
    }

    private Account resolveAccountAndVerifyOwnership(String accountNumber, Customer customer) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found: " + accountNumber));

        if (!account.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this account");
        }
        return account;
    }
}
