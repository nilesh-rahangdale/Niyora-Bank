package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.branch.Branch;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByBranchIfsc(String ifsc);

    Optional<Branch> findByBranchId(Long branchId);

    Optional<Branch> findByBranchCode(@Pattern(regexp = "\\d{6}", message = "Branch code must be exactly 6 digits") String branchCode);
}

