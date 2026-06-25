package com.niyora.EBankingSystem.Entities.users;

import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    private Long customerId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User createdBy;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "customer_id")
    private User user;

    private LocalDate dob;
    private String gender;
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;
    private String fatherName;
    private String address;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "customer_kyc_docs", joinColumns = @JoinColumn(name = "customer_id"))
    @MapKeyColumn(name = "doc_type")
    @Column(name = "doc_value")
    private Map<String, String> kycDocs;

////    @Lob
//    @OneToMany
//    private List<KycDocument> kycDocuments;


    private boolean KYCStatus;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accounts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Complaint> complaints = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<ServiceRequest> serviceRequests = new ArrayList<>();

//    public enum KYCStatus { ACTIVE, BLOCKED, INACTIVE }
    public enum MaritalStatus { MARRIED, UNMARRIED }
}
