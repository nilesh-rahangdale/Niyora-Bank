package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.users.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUserId(Long id);

    Optional<Admin> findByAdminId(Long adminId);
}

