package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
}

