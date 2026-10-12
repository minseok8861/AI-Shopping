package com.example.aishopping.member;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    Optional<Member> findByName(String name);
}


