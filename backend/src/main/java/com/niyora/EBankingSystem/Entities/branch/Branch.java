package com.niyora.EBankingSystem.Entities.branch;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import com.niyora.EBankingSystem.Entities.users.Admin;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.Manager;
import com.niyora.EBankingSystem.Entities.users.Teller;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;

    private String bankName;
    private String branchName;
    @Pattern(regexp = "\\d{6}", message = "Branch code must be exactly 6 digits")
    @Column(length = 6,unique = true)
    private String branchCode;
    @Pattern(regexp = "[A-Z]{4}0[A-Z0-9]{6}", message = "Branch IFSC must be 11 characters (4 letters + 0 + 6 alphanumeric)")
    @Size(min = 11, max = 11, message = "Branch IFSC must be exactly 11 characters")
    @Column(length = 11,unique = true)
    private String branchIfsc;
    private String address;
    private String contactNumber;

    @OneToOne(mappedBy = "branch")
    @JsonBackReference
    private Manager manager ;

    @OneToOne(mappedBy = "branch")
    private Admin admin ;

    @OneToMany(mappedBy = "branch")
    private List<Teller> tellers = new ArrayList<>();

    @OneToMany(mappedBy = "branch")
    private List<CSO> csos = new ArrayList<>();

    @OneToMany(mappedBy = "branch")
    private List<Account> accounts = new ArrayList<>();

    @OneToMany(mappedBy = "branch")
    private List<ServiceRequest> serviceRequestList = new ArrayList<>();

    @OneToMany(mappedBy = "branch")
    private List<Complaint> complaintList = new ArrayList<>();

}
