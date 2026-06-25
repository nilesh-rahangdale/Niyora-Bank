package com.niyora.EBankingSystem.Entities.audit;

import com.niyora.EBankingSystem.Entities.users.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Lob
    private String description;

    private LocalDateTime timestamp;
    private String ipAddress;

    public enum ActionType { LOGIN, ACCOUNT_CREATE, WITHDRAWAL, TRANSFER, DEPOSIT, KYC_VERIFICATION }
}

