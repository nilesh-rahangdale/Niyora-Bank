package com.niyora.EBankingSystem.Entities.requests;

import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.Teller;
import com.niyora.EBankingSystem.Entities.users.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;



//    @ManyToOne
//    @JoinColumn(name = "resolved_by_Teller")
//    private Teller resolvedByTeller;

    public enum RequestType { DEPOSIT_CASH,DEPOSIT_CHEQUE,WITHDRAW,CHEQUEBOOK, CARD_ISSUE, ACCOUNT_UPDATE }
    public enum Status { PENDING, RESOLVED, REJECTED }
}
