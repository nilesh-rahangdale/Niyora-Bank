package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.users.Teller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TellerRepository extends JpaRepository<Teller, Long> {
    List<Teller> findByBranchBranchId(Long branchId);
}

