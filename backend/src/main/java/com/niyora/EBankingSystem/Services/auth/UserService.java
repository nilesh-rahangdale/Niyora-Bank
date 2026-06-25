package com.niyora.EBankingSystem.Services.auth;

import com.niyora.EBankingSystem.DTOs.auth.ChangePassDto;
import com.niyora.EBankingSystem.DTOs.user.UserDto;
import com.niyora.EBankingSystem.Entities.users.User;
import com.niyora.EBankingSystem.Mappers.user.UserMapper;
import com.niyora.EBankingSystem.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public UserDto getUserById(Long id) {
        User user= userRepo.findById(id).orElseThrow(()-> new RuntimeException("User not found with id: " + id));
        UserDto userDto=userMapper.toUserDto(user);
        return userDto;
    }

    public UserDto findByEmail(String mail) {
        User user= userRepo.findByEmail(mail).orElseThrow(()->new RuntimeException("User not found with mail: " + mail));
        UserDto userDto=userMapper.toUserDto(user);
        return userDto;
    }

    public List<UserDto> findAll() {
        List<User> users = userRepo.findAll();
        return users.stream()
                .map(userMapper::toUserDto)
                .toList();
    }

    public UserDto changePassword(Long id, ChangePassDto changePassDto) {
        User user= userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if(! passwordEncoder.matches(changePassDto.getOldPassword(),user.getPassword())){
            throw new RuntimeException("Old password does not match"+"old password: " + changePassDto.getOldPassword() + ", user password: " + user.getPassword());
        }
        if(! changePassDto.getNewPassword().equals(changePassDto.getConfirmNewPassword())){
            throw new RuntimeException("New password and confirm password do not match");
        }
        user.setPassword(passwordEncoder.encode(changePassDto.getNewPassword()));
        User savedUser=userRepo.save(user);
        return userMapper.toUserDto(savedUser);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user=userRepo.findById(id).orElseThrow(()->new RuntimeException("User not found with id: " + id));
//        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        User SavedUser=userRepo.save(user);
        return userMapper.toUserDto(SavedUser);
    }

    public void deleteUser(Long id) {
        User user=userRepo.findById(id).orElseThrow(()-> new RuntimeException("User not found with id: " + id));
        userRepo.deleteById(id);
    }

}
