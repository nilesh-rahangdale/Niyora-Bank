package com.niyora.EBankingSystem.DTOs.complaint;

import com.niyora.EBankingSystem.Entities.requests.Complaint;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintRespDto {

    private Long complaintId;
    private Long customerId;
    private String customerName;
    private Long branchId;
    private String branchIfsc;
    private String branchName;
    private String description;
    private Complaint.Status status;
    private LocalDateTime createdAt;
    private String rejectReason;
    private Long resolvedById;
}
