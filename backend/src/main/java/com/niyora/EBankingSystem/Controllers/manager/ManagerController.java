package com.niyora.EBankingSystem.Controllers.manager;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.manager.ManagerDto;
import com.niyora.EBankingSystem.DTOs.manager.ManagerUpdateDto;
import com.niyora.EBankingSystem.DTOs.dashboard.ManagerDashboardDto;
import com.niyora.EBankingSystem.Entities.users.Manager;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.manager.ManagerMapper;
import com.niyora.EBankingSystem.Mappers.user.UserMapper;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import com.niyora.EBankingSystem.Services.manager.ManagerService;
import com.niyora.EBankingSystem.Services.dashboard.DashboardService;
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
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final AuthenticationService authenticationService;
    private final UserMapper userMapper;
    private final UserRepository userRepo ;
    private final ManagerMapper managerMapper;
    private final DashboardService dashboardService;

//    Register Manager User
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/registerManager/{branchId}")
    public ResponseEntity<ManagerDto> registerManagerUser(@RequestBody RegisterReqDto registerReqDto, @PathVariable Long branchId, Authentication authentication){
        if(authentication ==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email=authentication.getName();
        User loggedInUser=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found with email: "+email));

        Set<String> roles=new HashSet<>();
        roles.add("ROLE_MANAGER");
        return ResponseEntity.ok(managerService.registerManager(registerReqDto,roles,loggedInUser,branchId));
    }

//    Get Manager by ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping("/{managerId}")
    public ResponseEntity<ManagerDto> getManagerById(@PathVariable Long managerId) {
        Manager manager = managerService.getManagerById(managerId);
        return ResponseEntity.ok(managerMapper.toManagerDto(manager));
    }

    // Get all Managers
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<ManagerDto>> getAllManagers() {
        return ResponseEntity.ok(managerService.getAllManagers());
    }

    // Update Manager
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PutMapping("/{managerId}")
    public ResponseEntity<ManagerDto> updateManager(@PathVariable Long managerId, @RequestBody ManagerUpdateDto updateDto) {
        return ResponseEntity.ok(managerService.updateManager(managerId, updateDto));
    }

    // Manager Dashboard Analytics
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/dashboard")
    public ResponseEntity<ManagerDashboardDto> getManagerDashboard(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ManagerDashboardDto dashboard = dashboardService.getManagerDashboard(authentication.getName());
        return ResponseEntity.ok(dashboard);
    }

}
