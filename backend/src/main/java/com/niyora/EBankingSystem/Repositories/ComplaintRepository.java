package com.niyora.EBankingSystem.Repositories;

import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.users.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByCustomer(Customer customer);

    @Query("""
select c 
from Complaint c
join fetch c.customer cu
join fetch cu.user u
join fetch c.branch b
where cu.customerId = :customerId
""")
    List<Complaint> findCustomerComplaints(Long customerId);

}

