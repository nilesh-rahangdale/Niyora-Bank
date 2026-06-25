package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.users.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByManagerId(Long managerId);
}

