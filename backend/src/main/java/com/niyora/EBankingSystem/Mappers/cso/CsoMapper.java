package com.niyora.EBankingSystem.Mappers.cso;

import com.niyora.EBankingSystem.DTOs.cso.CsoDto;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CsoMapper {

    @Mapping(source = "user", target = "userDto")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "branch.branchId", target = "branchId")
    CsoDto toCsoDto(CSO csoEntity);

//    default Long map(User user){
//        return user != null ? user.getId() : null;
//    }
//
//    default Long map(Branch branch){
//        return branch != null ? branch.getBranchId() : null;
//    }

}
