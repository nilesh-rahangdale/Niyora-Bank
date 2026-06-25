package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.users.Teller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TellerRepository extends JpaRepository<Teller, Long> {
}

