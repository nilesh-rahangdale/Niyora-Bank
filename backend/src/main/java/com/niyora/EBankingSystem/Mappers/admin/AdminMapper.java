package com.niyora.EBankingSystem.Mappers.admin;
import com.niyora.EBankingSystem.DTOs.admin.AdminDTO;
import com.niyora.EBankingSystem.Entities.users.Admin;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "branch.branchId", target = "branchId")
    AdminDTO toDTO(Admin admin);

}
