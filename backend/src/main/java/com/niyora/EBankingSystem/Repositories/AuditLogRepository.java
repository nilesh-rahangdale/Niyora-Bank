package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.audit.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}

