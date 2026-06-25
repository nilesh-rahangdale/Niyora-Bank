package com.niyora.EBankingSystem.Entities.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import lombok.*;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "managers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manager {

    @Id
    private Long managerId;

    @ManyToOne
    private User createdBy;

    @OneToOne( fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "manager_id")
    @JsonManagedReference
    private User user;

    @OneToOne
    @JoinColumn(name = "branch_id")
    @JsonManagedReference
    private Branch branch;


//    @OneToMany(mappedBy = "manager")
//    private List<Teller> tellers = new ArrayList<>();

//    @OneToMany(mappedBy = "manager")
//    private List<CSO> csos = new ArrayList<>();
}
