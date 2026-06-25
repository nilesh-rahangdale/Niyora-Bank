package com.niyora.EBankingSystem.Entities.users;

import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import lombok.*;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "csos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CSO {

    @Id
    private Long csoId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User createdBy;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "cso_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

//    @ManyToOne
//    @JoinColumn(name = "manager_id")
//    private Manager manager;

//    @OneToMany(mappedBy = "resolvedByCSO")
//    private List<ServiceRequest> resolvedRequests = new ArrayList<>();
//
//    @OneToMany(mappedBy = "resolvedBy")
//    private List<Complaint> resolvedComplaints = new ArrayList<>();
}
