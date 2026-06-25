package com.niyora.EBankingSystem.Entities.cheque;

import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "cheques")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cheque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chequeId;

    @Column(unique = true)
    private String chequeNumber;

    private String issuingBank;
    private String branchCode;

//    @ManyToOne
//    @JoinColumn(name = "account_number")
//    private Account issuerAccount; // issuer account
//
//    @ManyToOne
//    @JoinColumn(name = "payee_account")
//    private Account payeeAccount; // destination account

    private String issuerAccount; // issuer account

    private String payeeAccount; // destination account

    private Double amount;
    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public enum Status { PENDING, CLEARED, BOUNCED, CANCELLED }
}
