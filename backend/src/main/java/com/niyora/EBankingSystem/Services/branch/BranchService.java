package com.niyora.EBankingSystem.Services.branch;

import com.niyora.EBankingSystem.DTOs.branch.BranchRegDto;
import com.niyora.EBankingSystem.DTOs.branch.BranchRespDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.Admin;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.branch.BranchMapper;
import com.niyora.EBankingSystem.Repositories.AdminRepository;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepo;
    private final BranchMapper branchMapper;
    private final UserRepository userRepo;
    private final AdminRepository adminRepo;

    @Transactional
    public BranchRespDto registerBranch(BranchRegDto regDto, String email) {

        User user=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found with email: "+email));
        Admin admin=adminRepo.findByUserId(user.getId()).orElseThrow(()->new RuntimeException("No admin found for user with email: "+email+" and id: "+user.getId()));

        Branch branch = new Branch();
        branch.setBankName(regDto.getBankName());
        branch.setBranchIfsc(regDto.getBranchIfsc());
        branch.setBranchName(regDto.getBranchName());
        branch.setBranchCode(regDto.getBranchCode());
        branch.setAddress(regDto.getAddress());
        branch.setContactNumber(regDto.getContactNumber());
        branch.setAdmin(admin);
        branch = branchRepo.save(branch);

        BranchRespDto branchRespDto = branchMapper.toBranchRespSto(branch);

        return branchRespDto;
    }

    public BranchRespDto getBranchById(Long branchId) {
        Branch branch=branchRepo.findById(branchId).orElseThrow(()->new RuntimeException("Branch not found with id: "+branchId));
        return branchMapper.toBranchRespSto(branch);
    }

    public BranchRespDto getBranchByIfsc(String ifsc) {
        Branch branch=branchRepo.findByBranchIfsc(ifsc).orElseThrow(()->new RuntimeException("Branch not found with IFSC: "+ifsc));
        return branchMapper.toBranchRespSto(branch);
    }

    public BranchRespDto getBranchByBranchCode(String branchCode) {
        Branch branch=branchRepo.findByBranchCode(branchCode).orElseThrow(()->new RuntimeException("Branch not found with Branch Code: "+branchCode));
        return branchMapper.toBranchRespSto(branch);
    }

    public List<BranchRespDto> getAllBranches() {
        return branchRepo.findAll().stream()
                .map(branchMapper::toBranchRespSto)
                .collect(Collectors.toList());
    }
}
