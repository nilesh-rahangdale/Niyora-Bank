package com.niyora.EBankingSystem.Controllers.MobileApis.request;

import com.niyora.EBankingSystem.DTOs.complaint.ComplaintRespDto;
import com.niyora.EBankingSystem.DTOs.complaint.FileComplaintReqDto;
import com.niyora.EBankingSystem.Services.customer.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mobile/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class MobileRequestController {

    private final ComplaintService complaintService;

    /**
     * POST /api/mobile/requests/fileComplaint
     * Allows an authenticated customer to file a new complaint.
     *
     * Request body: { "description": "...", "branchId": 1 }
     */
    @PostMapping("/fileComplaint")
    public ResponseEntity<ComplaintRespDto> fileComplaint(
            @RequestBody FileComplaintReqDto req,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ComplaintRespDto complaint = complaintService.fileComplaint(authentication.getName(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }

    /**
     * GET /api/mobile/requests/complaints
     * Returns a list of all complaints in the system.
     * Accessible by CSO, Manager, Admin.
     */
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintRespDto>> getAllComplaints(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String userEmail = authentication.getName();
        return ResponseEntity.ok(complaintService.getAllComplaintsByCustomer(userEmail));
    }






}
