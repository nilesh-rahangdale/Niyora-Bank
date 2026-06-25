package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.cheque.Cheque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChequeRepository extends JpaRepository<Cheque, Long> {
}

