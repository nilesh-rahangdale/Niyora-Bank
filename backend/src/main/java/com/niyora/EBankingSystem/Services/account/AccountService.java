package com.niyora.EBankingSystem.Services.account;

import com.niyora.EBankingSystem.DTOs.account.AccCreateReq;
import com.niyora.EBankingSystem.DTOs.account.AccountDto;
import com.niyora.EBankingSystem.DTOs.account.MoneyTransferDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionDto;
import com.niyora.EBankingSystem.DTOs.audit.TransactionRespDto;
import com.niyora.EBankingSystem.DTOs.cheque.ChequeReqDto;
import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.account.AccountMapper;
import com.niyora.EBankingSystem.Repositories.*;
import com.niyora.EBankingSystem.Services.audit.TransactionService;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final BranchRepository branchRepository;
    private final AccountNumberGeneratorService generator;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    public final TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final ChequeRepository chequeRepository;

    @Transactional
    public AccountDto createAccount(AccCreateReq accCreateReq, String csoMail) {

        Branch branch = branchRepository.findByBranchCode(accCreateReq.getBranchCode())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        Customer customer = customerRepository.findByCustomerId(accCreateReq.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + accCreateReq.getCustomerId()));
        String accNumber = generator.generateAccountNumber(branch);
        System.out.println(accNumber);
        Account account = Account.builder()
                .accountNumber(accNumber)
                .accountType(accCreateReq.getAccountType())
                .createdAt(LocalDateTime.now())
                .balance(0.0)
                .branch(branch)
                .customer(customer)
                .accountStatus(Account.Status.PENDING)
                .interestRate(2.75)
                .build();

        account = accountRepository.save(account);

        return accountMapper.toAccountDto(account);
    }

    public boolean isAccountOwner(String userEmail, Long customerId) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        return user.getId().equals(customerId);

    }

    public boolean isAccountOwner(String userEmail, String accountNumber) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with accountNumber: " + accountNumber));
        Long userId = user.getId();
        Long ownerId = account.getCustomer().getCustomerId();
        return userId.equals(ownerId);

    }

    public List<AccountDto> getAccountsByCustomerId(Long customerId) {
        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with customerId: " + customerId));
        List<Account> accounts = accountRepository.findAllByCustomer(customer);
        return accountMapper.toAccountDtoList(accounts);
    }

    public AccountDto getAccountByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with accountNumber: " + accountNumber));
        return accountMapper.toAccountDto(account);
    }

    public List<AccountDto> getAccountsByBranchCode(String branchCode) {
        Branch branch = branchRepository.findByBranchCode(branchCode)
                .orElseThrow(() -> new RuntimeException("Branch not found with branchCode: " + branchCode));
        List<Account> accounts = accountRepository.findAllByBranch(branch);
        return accountMapper.toAccountDtoList(accounts);
    }


    @Transactional
    public AccountDto depositCashToAccount(String accountNumber, Double amount, String tellerMail) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }

        User teller = userRepository.findByEmail(tellerMail)
                .orElseThrow(() -> new RuntimeException("Teller not found with email: " + tellerMail));

        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with accountNumber: " + accountNumber));

        try {


            account.setBalance(account.getBalance() + amount);

            TransactionDto transactionDto = TransactionDto.builder()
                    .account(account)
                    .amount(amount)
                    .transactionType(Transaction.TransactionType.CASH_DEPOSIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("Cash deposit of amount: " + amount)
                    .build();

            Transaction transaction = transactionService.createTransaction(transactionDto);

            if (account.getAccountStatus().equals(Account.Status.PENDING)) {
                account.setAccountStatus(Account.Status.ACTIVE);
            }

            account.getTransactions().add(transaction);

            // Save updated account
            Account acc = accountRepository.save(account);

            return accountMapper.toAccountDto(acc);
        } catch (Exception e) {
            TransactionDto transactionDto = TransactionDto.builder()
                    .account(account)
                    .amount(amount)
                    .transactionType(Transaction.TransactionType.CASH_DEPOSIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.FAILED)
                    .remarks("Failed to deposit cash: " + e.getMessage())
                    .build();
            transactionService.createTransaction(transactionDto);
//            Transaction transaction=transactionService.createTransaction(transactionDto);
//            failed transaction
            throw new RuntimeException("Failed to deposit cash: " + e.getMessage());
        }
    }


    @Transactional
    public AccountDto withdrawCashFromAccount(String accountNumber, Double amount, String tellerMail) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        User teller = userRepository.findByEmail(tellerMail)
                .orElseThrow(() -> new RuntimeException("Teller not found with email: " + tellerMail));

        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with accountNumber: " + accountNumber));

        try {

            if (account.getAccountStatus() != Account.Status.ACTIVE) {
                throw new IllegalArgumentException("Account is not active");
            }

            if (account.getBalance() < amount) {
                throw new IllegalArgumentException("Insufficient balance for withdrawal");
            }

            account.setBalance(account.getBalance() - amount);

            TransactionDto transactionDto = TransactionDto.builder()
                    .account(account)
                    .amount(amount)
                    .transactionType(Transaction.TransactionType.WITHDRAWAL)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("withdraw cash from amount: " + amount)
                    .build();

            Transaction transaction = transactionService.createTransaction(transactionDto);

            account.getTransactions().add(transaction);

            // Save updated account
            Account acc = accountRepository.save(account);

            return accountMapper.toAccountDto(acc);
        } catch (Exception e) {
            TransactionDto transactionDto = TransactionDto.builder()
                    .account(account)
                    .amount(amount)
                    .transactionType(Transaction.TransactionType.WITHDRAWAL)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.FAILED)
                    .remarks("Failed to withdraw cash: " + e.getMessage())
                    .build();

            transactionService.createTransaction(transactionDto);
//            failed transaction
            throw new RuntimeException("Failed to withdraw cash: " + e.getMessage());
        }

    }


    @Transactional()
    public void internalMoneyTransfer(MoneyTransferDto moneyTransferDto, String tellerMail) {

        User teller = userRepository.findByEmail(tellerMail)
                .orElseThrow(() -> new RuntimeException("Teller not found with email: " + tellerMail));

        // Validation before locking
        if (moneyTransferDto.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (moneyTransferDto.getFromAccountNumber().equals(moneyTransferDto.getToAccountNumber())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        // Lock accounts in consistent order to prevent deadlocks

        Account fromAccount = accountRepository.findByAccountNumberForUpdate(moneyTransferDto.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found: " + moneyTransferDto.getFromAccountNumber()));

        Account toAccount = accountRepository.findByAccountNumberForUpdate(moneyTransferDto.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found: " + moneyTransferDto.getToAccountNumber()));


        try {
            // Validate account status
            if (fromAccount.getAccountStatus() != Account.Status.ACTIVE) {
                throw new IllegalArgumentException("Source account is not active");
            }
            if (toAccount.getAccountStatus() != Account.Status.ACTIVE) {
                throw new IllegalArgumentException("Destination account is not active");
            }

            // Check balance
            if (fromAccount.getBalance() < moneyTransferDto.getAmount()) {
                throw new IllegalArgumentException("Insufficient balance for money transfer");
            }

            // Perform transfer
            fromAccount.setBalance(fromAccount.getBalance() - moneyTransferDto.getAmount());
            toAccount.setBalance(toAccount.getBalance() + moneyTransferDto.getAmount());

            // Create debit transaction
            TransactionDto debitDto = TransactionDto.builder()
                    .account(fromAccount)
                    .amount(moneyTransferDto.getAmount())
                    .transactionType(Transaction.TransactionType.INTERNAL_TRANSFER_DEBIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("Debited to account: " + toAccount.getAccountNumber())
                    .build();

            Transaction debitTransaction = transactionService.createTransaction(debitDto);
            fromAccount.getTransactions().add(debitTransaction);

            // Create credit transaction
            TransactionDto creditDto = TransactionDto.builder()
                    .account(toAccount)
                    .amount(moneyTransferDto.getAmount())
                    .transactionType(Transaction.TransactionType.INTERNAL_TRANSFER_CREDIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("Credited from account: " + fromAccount.getAccountNumber())
                    .build();

            Transaction creditTransaction = transactionService.createTransaction(creditDto);
            toAccount.getTransactions().add(creditTransaction);

            // Save both accounts
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);

        } catch (Exception e) {
            // Record failed transaction on source account
            TransactionDto failedDto = TransactionDto.builder()
                    .account(fromAccount)
                    .amount(moneyTransferDto.getAmount())
                    .transactionType(Transaction.TransactionType.INTERNAL_TRANSFER_DEBIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.FAILED)
                    .remarks("Transfer to " + toAccount.getAccountNumber() + " failed: " + e.getMessage())
                    .build();

            transactionService.createTransaction(failedDto);
            throw new RuntimeException("Money transfer failed: " + e.getMessage(), e);
        }
    }

    public List<TransactionRespDto> getTransactionsByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with accountNumber: " + accountNumber));

        return account.getTransactions().stream()
                .map(t -> TransactionRespDto.builder()
                        .amount(t.getAmount())
                        .transactionType(t.getTransactionType())
                        .transactionDate(t.getTransactionDate())
                        .processedById(t.getProcessedBy().getId())
                        .status(t.getStatus())
                        .remarks(t.getRemarks())
                        .build())
                .toList();
    }


    @Transactional()
    public void chequeDeposit(ChequeReqDto chequeReqDto, String tellerMail) {
        User teller = userRepository.findByEmail(tellerMail)
                .orElseThrow(() -> new RuntimeException("Teller not found with email: " + tellerMail));

        if (chequeReqDto.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (chequeReqDto.getIssuerAccountNumber().equals(chequeReqDto.getPayeeAccountNumber())) {
            throw new IllegalArgumentException("Cannot deposit to the same account");
        }

        Account issuerAccount = accountRepository.findByAccountNumberForUpdate(chequeReqDto.getIssuerAccountNumber())
                .orElseThrow(() -> new RuntimeException("Issuer account not found: " + chequeReqDto.getIssuerAccountNumber()));

        Account payeeAccount = accountRepository.findByAccountNumberForUpdate(chequeReqDto.getPayeeAccountNumber())
                .orElseThrow(() -> new RuntimeException("Payee account not found: " + chequeReqDto.getPayeeAccountNumber()));

        try {
            if (issuerAccount.getAccountStatus() != Account.Status.ACTIVE) {
                throw new IllegalArgumentException("Issuer account is not active");
            }
            if (payeeAccount.getAccountStatus() != Account.Status.ACTIVE) {
                throw new IllegalArgumentException("Payee account is not active");
            }
            if (issuerAccount.getBalance() < chequeReqDto.getAmount()) {
                throw new IllegalArgumentException("Insufficient balance in issuer account");
            }

            issuerAccount.setBalance(issuerAccount.getBalance() - chequeReqDto.getAmount());
            payeeAccount.setBalance(payeeAccount.getBalance() + chequeReqDto.getAmount());

            Cheque cheque = Cheque.builder()
                    .chequeNumber(chequeReqDto.getChequeNumber())
                    .issuingBank(chequeReqDto.getIssuingBank())
                    .branchCode(chequeReqDto.getBranchCode())
                    .issuerAccount(chequeReqDto.getIssuerAccountNumber())
                    .payeeAccount(chequeReqDto.getPayeeAccountNumber())
                    .amount(chequeReqDto.getAmount())
                    .issueDate(chequeReqDto.getIssueDate())
                    .status(Cheque.Status.CLEARED)
                    .build();

            cheque = chequeRepository.save(cheque);

            TransactionDto debitDto = TransactionDto.builder()
                    .account(issuerAccount)
                    .amount(chequeReqDto.getAmount())
                    .transactionType(Transaction.TransactionType.CHEQUE_WITHDRAWAL)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("Cheque cleared to account: " + payeeAccount.getAccountNumber())
                    .cheque(cheque)
                    .build();

            Transaction debitTransaction = transactionService.createTransaction(debitDto);
            issuerAccount.getTransactions().add(debitTransaction);

            TransactionDto creditDto = TransactionDto.builder()
                    .account(payeeAccount)
                    .amount(chequeReqDto.getAmount())
                    .transactionType(Transaction.TransactionType.CHEQUE_DEPOSIT)
                    .transactionDate(LocalDateTime.now())
                    .processedBy(teller)
                    .status(Transaction.Status.SUCCESS)
                    .remarks("Cheque deposit from account: " + issuerAccount.getAccountNumber())
                    .cheque(cheque)
                    .build();

            Transaction creditTransaction = transactionService.createTransaction(creditDto);
            payeeAccount.getTransactions().add(creditTransaction);

            cheque.setTransaction(creditTransaction);
            chequeRepository.save(cheque);

            accountRepository.save(issuerAccount);
            accountRepository.save(payeeAccount);

        } catch (Exception e) {
            throw new RuntimeException("Cheque deposit failed: " + e.getMessage(), e);
        }
    }

//    END
}
