package com.niyora.EBankingSystem.Entities.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.niyora.EBankingSystem.Entities.audit.AuditLog;
import com.niyora.EBankingSystem.Entities.audit.Transaction;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;


    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles;

    private String email;
    @Column(nullable = false)
    private Boolean isEmailVerified=false;
    private String phoneNumber;
    @Column(nullable = false)
    private Boolean isPhoneNumberVerified=false;
    private String mailOtp;
    private String phoneOtp;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    private Admin admin;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    private Manager manager;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Teller teller;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private CSO cso;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Customer customer;

    @OneToMany(mappedBy = "processedBy", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaction> processedTransactions = new ArrayList<>();

    @OneToMany(mappedBy = "resolvedBy", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Complaint> resolvedComplaints = new ArrayList<>();

    @OneToMany(mappedBy = "resolvedBy", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ServiceRequest> resolvedRequests = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AuditLog> auditLogs = new ArrayList<>();

//    public enum Role { ADMIN, MANAGER, TELLER, CSO, CUSTOMER }
    public enum Status { ACTIVE, INACTIVE, BLOCKED }



    @PrePersist
    protected void onCreate(){
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
    }

//    @PreUpdate
//    protected void onUpdate(){
//        this.updatedAt=LocalDateTime.now();
//    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
