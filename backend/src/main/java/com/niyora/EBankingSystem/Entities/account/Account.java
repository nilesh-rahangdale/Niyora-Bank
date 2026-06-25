package com.niyora.EBankingSystem.Entities.account;

import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", length = 12, unique = true, nullable = false)
    private String accountNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private Double balance;
    private Double interestRate;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private Status accountStatus;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

//    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
//    private List<Cheque> cheques = new ArrayList<>();

    public enum AccountType { SAVINGS, CURRENT }
    public enum Status { PENDING,ACTIVE, INACTIVE, CLOSED }
}
