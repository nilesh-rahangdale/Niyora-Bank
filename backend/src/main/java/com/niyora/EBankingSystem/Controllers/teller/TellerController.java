package com.niyora.EBankingSystem.Controllers.teller;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.teller.TellerDto;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.teller.TellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/teller")
@RequiredArgsConstructor
public class TellerController {

    private final TellerService tellerService;
    private final UserRepository userRepo;

//    Register Teller
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PostMapping("/registerTeller/{branchId}")
    public ResponseEntity<TellerDto> registerTellerUser(@RequestBody RegisterReqDto registerReqDto, @PathVariable Long branchId, Authentication authentication){
        if(authentication ==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email=authentication.getName();
        User loggedInUser=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found with email: "+email));

        Set<String> roles=new HashSet<>();
        roles.add("ROLE_TELLER");
        return ResponseEntity.ok(tellerService.registerTeller(registerReqDto,roles,loggedInUser,branchId));
    }

    //    Get Teller by ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('Teller')")
    @GetMapping("/{tellerId}")
    public ResponseEntity<TellerDto> getTellerById(@PathVariable Long tellerId) {
        TellerDto tellerDto = tellerService.getTellerById(tellerId);
        return ResponseEntity.ok(tellerDto);
    }

//    Set cashDrawer
    @PreAuthorize("hasRole('TELLER')")
    @PostMapping("/setCashDrawer/{cashDrawerId}")
    public ResponseEntity<TellerDto> setCashDrawer(@PathVariable String cashDrawerId,Authentication auth) {
        if(auth ==null){
            throw new RuntimeException("User is not Authenticated");
        }
        String email=auth.getName();
        return ResponseEntity.ok(tellerService.setCashDrawer(cashDrawerId,email));
    }


    //    update lastBalanced
    @PreAuthorize("hasRole('TELLER')")
    @PostMapping("/setLastBalanced/")
    public ResponseEntity<TellerDto> setLastBalanced(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime lastBalancedDate, Authentication auth) {
        if(auth ==null){
            throw new RuntimeException("User is not Authenticated");
        }
        String email=auth.getName();
        return ResponseEntity.ok(tellerService.setLastBalanced(lastBalancedDate,email));
    }


}
