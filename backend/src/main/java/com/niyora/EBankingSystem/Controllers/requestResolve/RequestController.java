package com.niyora.EBankingSystem.Controllers.requestResolve;

import com.niyora.EBankingSystem.DTOs.complaint.ComplaintRespDto;
import com.niyora.EBankingSystem.DTOs.complaint.HandleComplaintReqDto;
import com.niyora.EBankingSystem.Services.customer.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final ComplaintService complaintService;

    /**
     * GET /api/requests/complaints
     * Returns a list of all complaints in the system.
     * Accessible by CSO, Manager, Admin.
     */
    @GetMapping("/complaints")
    @PreAuthorize("hasAnyRole('CSO', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<ComplaintRespDto>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    /**
     * GET /api/requests/complaints/{complaintId}
     * Returns details of a single complaint by its ID.
     * Accessible by CSO, Manager, Admin.
     */
    @GetMapping("/complaints/{complaintId}")
    @PreAuthorize("hasAnyRole('CSO', 'MANAGER', 'ADMIN')")
    public ResponseEntity<ComplaintRespDto> getComplaintById(@PathVariable Long complaintId) {
        return ResponseEntity.ok(complaintService.getComplaintById(complaintId));
    }

    /**
     * PATCH /api/requests/complaints/{complaintId}/handle
     * Resolves or rejects a complaint.
     * If status = REJECTED, a rejectReason must be provided in the body.
     * Accessible by CSO, Manager.
     *
     * Request body: { "status": "RESOLVED" | "REJECTED", "rejectReason": "..." }
     */
    @PatchMapping("/complaints/{complaintId}/handle")
    @PreAuthorize("hasAnyRole('CSO', 'MANAGER')")
    public ResponseEntity<ComplaintRespDto> handleComplaint(
            @PathVariable Long complaintId,
            @RequestBody HandleComplaintReqDto req,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ComplaintRespDto updated = complaintService.handleComplaint(complaintId, authentication.getName(), req);
        return ResponseEntity.ok(updated);
    }
}
