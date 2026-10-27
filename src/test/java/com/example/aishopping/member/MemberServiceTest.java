package com.example.aishopping.member;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MemberServiceTest {
    private final MemberRepository repository = mock(MemberRepository.class);
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private final MemberService service = new MemberService(repository, encoder);
    private Member member;

    @BeforeEach
    void setup() {
        member = new Member();
        member.setName("user");
        member.setEmail("old@example.com");
        member.setPassword(encoder.encode("password123"));
        when(repository.findByName("user")).thenReturn(Optional.of(member));
    }

    @Test
    void updatesEmailAndEncodesNewPassword() {
        when(repository.saveAndFlush(any(Member.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Member updated = service.updateMember("user", "new@example.com", "password123", "newpassword123");
        assertEquals("new@example.com", updated.getEmail());
        assertTrue(encoder.matches("newpassword123", updated.getPassword()));
    }

    @Test
    void rejectsWrongPasswordAndDuplicateEmail() {
        assertThrows(IllegalArgumentException.class, () -> service.updateMember("user", "new@example.com", "wrong", ""));
        when(repository.existsByEmail("taken@example.com")).thenReturn(true);
        assertThrows(IllegalStateException.class, () -> service.updateMember("user", "taken@example.com", "password123", ""));
        verify(repository, never()).saveAndFlush(any());
    }

    @Test
    void requiresPasswordBeforeDeleting() {
        assertThrows(IllegalArgumentException.class, () -> service.deleteMember("user", "wrong"));
        verify(repository, never()).delete(any());
        service.deleteMember("user", "password123");
        verify(repository).delete(member);
    }
}
