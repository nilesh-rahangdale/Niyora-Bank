package com.niyora.EBankingSystem.Mappers.branch;

import com.niyora.EBankingSystem.DTOs.branch.BranchRespDto;
import com.niyora.EBankingSystem.Entities.account.Account;
import com.niyora.EBankingSystem.Entities.branch.Branch;
import com.niyora.EBankingSystem.Entities.requests.Complaint;
import com.niyora.EBankingSystem.Entities.requests.ServiceRequest;
import com.niyora.EBankingSystem.Entities.users.CSO;
import com.niyora.EBankingSystem.Entities.users.Manager;
import com.niyora.EBankingSystem.Entities.users.Teller;
import com.niyora.EBankingSystem.Entities.users.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BranchMapper {

    @Mapping(source = "manager.user", target = "managerId")
    @Mapping(source = "admin.user", target = "adminId")
    @Mapping(source = "tellers", target = "tellersId")
    @Mapping(source = "csos", target = "csosId")
    @Mapping(source = "accounts", target = "accountsNumbers")
    BranchRespDto toBranchRespSto(Branch branch);

    default Long map(Teller teller){
        return teller==null ? null : teller.getTellerId();
    }

    default Long map(CSO cso){
        return cso==null ? null : cso.getCsoId();
    }

    default String map(Account account){
        return account==null? null: account.getAccountNumber();
    }

    default Long map(User user){
        return user==null? null: user.getId();
    }

    default Long map(ServiceRequest request){
        return request==null? null: request.getRequestId();
    }

    default Long map(Complaint complaint){
        return complaint==null? null: complaint.getComplaintId();
    }


}
