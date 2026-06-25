package com.niyora.EBankingSystem.Entities.account;


import com.niyora.EBankingSystem.Entities.branch.Branch;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "branch_account_sequences",
        uniqueConstraints = @UniqueConstraint(columnNames = {"branch_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchAccountSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "branch_id", nullable = false, unique = true)
    private Branch branch;

    @Column(name = "last_sequence", nullable = false)
    private long lastSequence;
}

