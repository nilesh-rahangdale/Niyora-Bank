package com.niyora.EBankingSystem.Entities.users;

import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tellers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teller {

    @Id
    private Long tellerId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User createdBy;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "teller_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

//    @ManyToOne
//    @JoinColumn(name = "manager_id")
//    private Manager manager;

//    @OneToMany(mappedBy = "resolvedByTeller")
//    private List<ServiceRequest> resolvedRequests = new ArrayList<>();

    private String cashDrawerId;

//    @Enumerated(EnumType.STRING)
//    private Shift shift;
//
//    private Double dailyLimit;

    private LocalDateTime lastBalanced;

//    public enum Shift { MORNING, EVENING, NIGHT }
}
