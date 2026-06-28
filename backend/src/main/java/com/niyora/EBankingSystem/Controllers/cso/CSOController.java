package com.niyora.EBankingSystem.Controllers.cso;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.cso.CsoDto;
import com.niyora.EBankingSystem.DTOs.cso.CsoUpdateDto;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.cso.CsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/cso")
@RequiredArgsConstructor
public class CSOController {

    private final CsoService csoService;
    private final UserRepository userRepo;

//    Register Cso
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PostMapping("/registerCso/{branchId}")
    public ResponseEntity<CsoDto> registerCSOUser(@RequestBody RegisterReqDto registerReqDto, @PathVariable Long branchId, Authentication authentication){
        if(authentication ==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email=authentication.getName();
        User loggedInUser=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found with email: "+email));

        Set<String> roles=new HashSet<>();
        roles.add("ROLE_CSO");
        return ResponseEntity.ok(csoService.registerCso(registerReqDto,roles,loggedInUser,branchId));
    }

    //    Get Cso by ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CSO')")
    @GetMapping("/{csoId}")
    public ResponseEntity<CsoDto> getCsoById(@PathVariable Long csoId) {
        CsoDto csoDto = csoService.getCsoById(csoId);
        return ResponseEntity.ok(csoDto);
    }

    // Get all CSOs
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<CsoDto>> getAllCsos() {
        return ResponseEntity.ok(csoService.getAllCsos());
    }

    // Update CSO
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PutMapping("/{csoId}")
    public ResponseEntity<CsoDto> updateCso(@PathVariable Long csoId, @RequestBody CsoUpdateDto updateDto) {
        return ResponseEntity.ok(csoService.updateCso(csoId, updateDto));
    }

}
