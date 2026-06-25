package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.account.BranchAccountSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchAccountSequenceRepository extends JpaRepository<BranchAccountSequence, Long> {

    // Use PESSIMISTIC_WRITE to lock the row while we increment
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM BranchAccountSequence s WHERE s.branch.branchId = :branchId")
    Optional<BranchAccountSequence> findByBranchIdForUpdate(@Param("branchId") Long branchId);
}

