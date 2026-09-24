package com.freshroots.repository;
import com.freshroots.model.User;
import com.freshroots.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
}
