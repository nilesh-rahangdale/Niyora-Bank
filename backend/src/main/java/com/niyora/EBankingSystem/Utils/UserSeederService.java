//package com.niyora.EBankingSystem.Utils;
//
//import com.niyora.EBankingSystem.Entities.users.*;
//import com.niyora.EBankingSystem.Repositories.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.Set;
//
//@Component
//@RequiredArgsConstructor
//public class UserSeederService implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) throws Exception {
//        seedUser("admin@niyorabank.com", "System Admin", "ROLE_ADMIN");
//        seedUser("manager@niyorabank.com", "Branch Manager", "ROLE_MANAGER");
//        seedUser("teller@niyorabank.com", "Bank Teller", "ROLE_TELLER");
//        seedUser("cso@niyorabank.com", "Customer Service Officer", "ROLE_CSO");
//    }
//
//    private void seedUser(String email, String fullName, String role) {
//        if (!userRepository.existsByEmail(email)) {
//            User user = new User();
//            user.setEmail(email);
//            user.setFullName(fullName);
//            user.setPassword(passwordEncoder.encode("Admin@123"));
//            user.setRoles(Set.of(role));
//            user.setStatus(User.Status.ACTIVE);
//            user.setIsEmailVerified(true);
//            user.setIsPhoneNumberVerified(true);
//            user.setCreatedAt(LocalDateTime.now());
//            user.setUpdatedAt(LocalDateTime.now());
//
//            if (role.equals("ROLE_ADMIN")) {
//                Admin admin = new Admin();
//                admin.setUser(user);
//                user.setAdmin(admin);
//            } else if (role.equals("ROLE_MANAGER")) {
//                Manager manager = new Manager();
//                manager.setUser(user);
//                user.setManager(manager);
//            } else if (role.equals("ROLE_TELLER")) {
//                Teller teller = new Teller();
//                teller.setUser(user);
//                user.setTeller(teller);
//            } else if (role.equals("ROLE_CSO")) {
//                CSO cso = new CSO();
//                cso.setUser(user);
//                user.setCso(cso);
//            }
//
//            userRepository.save(user);
//            System.out.println("Seeded user: " + email + " with role: " + role);
//        }
//    }
//}
