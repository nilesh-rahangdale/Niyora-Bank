package com.niyora.EBankingSystem.Controllers.branch;


import com.niyora.EBankingSystem.DTOs.branch.BranchRegDto;
import com.niyora.EBankingSystem.DTOs.branch.BranchRespDto;
import com.niyora.EBankingSystem.Services.branch.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

// Register branch
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> registerBranch(@RequestBody BranchRegDto regDto, Authentication auth){
        if(auth ==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        return ResponseEntity.ok(branchService.registerBranch(regDto,auth.getName()));
    }

//    Get Branch by ID
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{branchId}")
    public ResponseEntity<?> getBranchById(@PathVariable Long branchId, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        BranchRespDto branch = branchService.getBranchById(branchId);
        return ResponseEntity.ok(branch);
    }

//    Get Branch by IFSC
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/ifsc/{ifsc}")
    public ResponseEntity<?> getBranchByIfsc(@PathVariable String ifsc, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        BranchRespDto branch = branchService.getBranchByIfsc(ifsc);
        return ResponseEntity.ok(branch);
    }
//    //    Get Branch by Branch Code

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/branchCode/{branchCode}")
    public ResponseEntity<?> getBranchByBranchCode(@PathVariable String branchCode, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        BranchRespDto branch = branchService.getBranchByBranchCode(branchCode);
        return ResponseEntity.ok(branch);
    }

}
