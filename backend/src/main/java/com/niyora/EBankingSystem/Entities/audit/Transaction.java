package com.niyora.EBankingSystem.Entities.audit;

import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "account_number")
    private Account account;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private Double amount;
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "processed_by")
    private User processedBy;

    private String remarks;

    @OneToOne(mappedBy = "transaction")
    private Cheque cheque;

    public enum TransactionType { CASH_DEPOSIT,CHEQUE_DEPOSIT, CHEQUE_WITHDRAWAL, WITHDRAWAL, INTERNAL_TRANSFER_DEBIT,INTERNAL_TRANSFER_CREDIT }
    public enum Status { PENDING, SUCCESS, FAILED }
}
