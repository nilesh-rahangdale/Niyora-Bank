package com.niyora.EBankingSystem.Services.customer;

import com.niyora.EBankingSystem.DTOs.complaint.ComplaintRespDto;
import com.niyora.EBankingSystem.DTOs.complaint.FileComplaintReqDto;
import com.niyora.EBankingSystem.DTOs.complaint.HandleComplaintReqDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.users.Customer;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Repositories.ComplaintRepository;
import com.niyora.EBankingSystem.Repositories.CustomerRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    // ─── Customer-facing ─────────────────────────────────────────────────────────

    /**
     * Allows an authenticated customer to file a new complaint.
     */
    @Transactional
    public ComplaintRespDto fileComplaint(String customerEmail, FileComplaintReqDto req) {
        User user = resolveUser(customerEmail);
        Customer customer = customerRepository.findByCustomerId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Customer profile not found for: " + customerEmail));

        Branch branch = branchRepository.findByBranchIfsc(req.getBranchIfsc())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Branch not found with id: " + req.getBranchIfsc()));

        Complaint complaint = Complaint.builder()
                .customer(customer)
                .branch(branch)
                .description(req.getDescription())
                .status(Complaint.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return toDto(saved);
    }

    public List<ComplaintRespDto> getAllComplaintsByCustomer(String customerEmail) {
        User user = resolveUser(customerEmail);
        Customer customer = customerRepository.findByCustomerId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Customer profile not found for: " + customerEmail));
        return complaintRepository.findCustomerComplaints(customer.getCustomerId()).stream()
                .map(this::toDto)
                .toList();
    }

    // ─── Staff-facing ─────────────────────────────────────────────────────────────

    /**
     * Returns all complaints in the system.
     */
    public List<ComplaintRespDto> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Returns a single complaint by its ID.
     */
    public ComplaintRespDto getComplaintById(Long complaintId) {
        Complaint complaint = resolveComplaint(complaintId);
        return toDto(complaint);
    }

    /**
     * Handles a complaint by marking it RESOLVED or REJECTED.
     * If rejected, a rejectReason must be provided.
     */
    @Transactional
    public ComplaintRespDto handleComplaint(Long complaintId, String staffEmail, HandleComplaintReqDto req) {
        Complaint complaint = resolveComplaint(complaintId);

        if (complaint.getStatus() != Complaint.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Complaint is already " + complaint.getStatus());
        }

        if (req.getStatus() == Complaint.Status.REJECTED) {
            if (req.getRejectReason() == null || req.getRejectReason().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "A reject reason is required when rejecting a complaint");
            }
            complaint.setRejectReason(req.getRejectReason());
        } else if (req.getStatus() == Complaint.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Status must be RESOLVED or REJECTED");
        }

        User staff = resolveUser(staffEmail);
        complaint.setStatus(req.getStatus());
        complaint.setResolvedBy(staff);

        Complaint updated = complaintRepository.save(complaint);
        return toDto(updated);
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────────

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found: " + email));
    }

    private Complaint resolveComplaint(Long complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Complaint not found with id: " + complaintId));
    }

    private ComplaintRespDto toDto(Complaint c) {
        return ComplaintRespDto.builder()
                .complaintId(c.getComplaintId())
                .customerId(c.getCustomer() != null ? c.getCustomer().getCustomerId() : null)
                .customerName(c.getCustomer() != null && c.getCustomer().getUser() != null
                        ? c.getCustomer().getUser().getFullName() : null)
                .branchId(c.getBranch() != null ? c.getBranch().getBranchId() : null)
                .branchIfsc(c.getBranch() != null ? c.getBranch().getBranchIfsc() : null)
                .branchName(c.getBranch() != null ? c.getBranch().getBranchName() : null)
                .description(c.getDescription())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .rejectReason(c.getRejectReason())
                .resolvedById(c.getResolvedBy() != null ? c.getResolvedBy().getId() : null)
                .build();
    }


}
