package com.niyora.EBankingSystem.Entities.users;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {


    @Id
    private Long adminId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;


    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    private String adminLevel;


    private String permissions;
}
