package com.niyora.EBankingSystem.Mappers.user;

import com.niyora.EBankingSystem.DTOs.user.UserDto;
import com.niyora.EBankingSystem.Entities.users.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {


//    User toUser(UserDto userDto);


    UserDto toUserDto(User user);
}