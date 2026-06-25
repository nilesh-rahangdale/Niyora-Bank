package com.niyora.EBankingSystem.DTOs.branch;

import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BranchRespDto {
    private Long branchId;
    private String bankName;
    private String branchName;
    private String branchCode;
    private String branchIfsc;
    private String address;
    private String contactNumber;

    private Long managerId ;

    private Long adminId ;

    private List<Long> tellersId = new ArrayList<>();

    private List<Long> csosId = new ArrayList<>();

    private List<String> accountsNumbers = new ArrayList<>();

    private List<Long> serviceRequestList = new ArrayList<>();

    private List<Long> complaintList = new ArrayList<>();
}
