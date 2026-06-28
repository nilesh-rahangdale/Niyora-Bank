package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.users.CSO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CSORepository extends JpaRepository<CSO, Long> {
    List<CSO> findByBranchBranchId(Long branchId);
}

