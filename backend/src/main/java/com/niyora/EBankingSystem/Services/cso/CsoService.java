package com.niyora.EBankingSystem.Services.cso;

import com.niyora.EBankingSystem.DTOs.auth.RegisterReqDto;
import com.niyora.EBankingSystem.DTOs.cso.CsoDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.cso.CsoMapper;
import com.niyora.EBankingSystem.Repositories.BranchRepository;
import com.niyora.EBankingSystem.Repositories.CSORepository;
import com.niyora.EBankingSystem.Repositories.ManagerRepository;
import com.niyora.EBankingSystem.Services.auth.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CsoService {

    private final CSORepository csoRepo;
    private final CsoMapper csoMapper;
    private final ManagerRepository managerRepo;
    private final BranchRepository branchRepo;
    private final AuthenticationService authService;

    @Transactional
    public CsoDto registerCso(RegisterReqDto registerReqDto, Set<String> roles, User loggedInUser, Long branchId) {
        try{
            User newUser=authService.registerUser(registerReqDto,roles);
            Branch branch=branchRepo.findById(branchId).orElseThrow(
                    ()-> new RuntimeException("Branch not found with id: "+branchId)
            );

            CSO cso=CSO.builder()
                    .user(newUser)
                    .createdBy(loggedInUser)
                    .branch(branch)
                    .build();

            cso=csoRepo.save(cso);

            return csoMapper.toCsoDto(cso);

        }catch (Exception e){
            System.out.println(e);
            throw new RuntimeException(e);
        }

    }

    public CsoDto getCsoById(Long csoId) {
        CSO cso=csoRepo.findById(csoId).orElseThrow(
                ()-> new RuntimeException("CSO not found with id: "+csoId)
        );
        return csoMapper.toCsoDto(cso);
    }


}
