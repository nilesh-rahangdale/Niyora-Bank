package com.niyora.EBankingSystem.Mappers.manager;

import com.niyora.EBankingSystem.DTOs.manager.ManagerDto;
import com.niyora.EBankingSystem.Entities.users.Manager;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ManagerMapper {

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "branch.branchId", target = "branchId")
    @Mapping(source = "user", target = "userDto")
    ManagerDto toManagerDto(Manager manager);

}
