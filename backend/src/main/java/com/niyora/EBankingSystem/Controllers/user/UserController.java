package com.niyora.EBankingSystem.Controllers.user;

import com.niyora.EBankingSystem.DTOs.auth.ChangePassDto;
import com.niyora.EBankingSystem.DTOs.user.UserDto;
import com.niyora.EBankingSystem.Services.auth.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUserById/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

//    @GetMapping("/getUserByUsername/{username}")
//    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username){
//        return ResponseEntity.ok(userService.findByUsername(username));
//    }

    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getALlUsers(){
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<UserDto> changePassword(@PathVariable Long id, @RequestBody ChangePassDto changePassDto){
//        userService.changePassword(id,changePassDto);
        return ResponseEntity.ok(userService.changePassword(id,changePassDto));
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,@RequestBody UserDto userDto){
//        userService.updateUser(id,userDto);
        return ResponseEntity.ok(userService.updateUser(id,userDto));
    }

    @DeleteMapping("/deleteUser/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

}
