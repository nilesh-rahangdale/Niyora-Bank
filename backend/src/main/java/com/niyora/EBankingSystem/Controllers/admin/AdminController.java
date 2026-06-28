package com.niyora.EBankingSystem.Controllers.admin;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.admin.AdminDTO;
import com.niyora.EBankingSystem.DTOs.admin.AdminUpdateDto;
import com.niyora.EBankingSystem.DTOs.dashboard.AdminDashboardDto;
import com.niyora.EBankingSystem.Entities.users.Admin;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.user.UserMapper;
import com.niyora.EBankingSystem.Mappers.admin.AdminMapper;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import com.niyora.EBankingSystem.Services.admin.AdminService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthenticationService authenticationService;
    private final ManagerService managerService;
    private final UserMapper userMapper;
    private final UserRepository userRepo ;
    private final AdminService adminService;
    private final AdminMapper adminMapper;
    private final DashboardService dashboardService;


// Register Admin User
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/registerAdminUser")
    public ResponseEntity<AdminDTO> registerAdminUser(@RequestBody RegisterReqDto registerReqDto, Authentication authentication){

        if(authentication ==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email=authentication.getName();
        User loggedInUser=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found with email: "+email));

        Set<String> roles=new HashSet<>();
        roles.add("ROLE_ADMIN");

        Admin admin=adminService.registerAdmin(registerReqDto,roles,loggedInUser);


        return ResponseEntity.ok(adminMapper.toDTO(admin));
    }

//    Get Admin by id
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping("/{adminId}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Long adminId) {
        Admin admin = adminService.getAdminById(adminId);
        return ResponseEntity.ok(adminMapper.toDTO(admin));
    }

    // Get all Admins
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminDTO> admins = adminService.getAllAdmins().stream()
                .map(adminMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(admins);
    }

    // Update Admin
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PutMapping("/{adminId}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long adminId, @RequestBody AdminUpdateDto updateDto) {
        Admin updatedAdmin = adminService.updateAdmin(adminId, updateDto);
        return ResponseEntity.ok(adminMapper.toDTO(updatedAdmin));
    }

    // Admin Dashboard Analytics
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        AdminDashboardDto dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

}
