package com.example.aishopping.member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;


    public Member createMember(String name, String email, String password) {
        if (memberRepository.existsByName(name)) {
            throw new IllegalStateException("이미 등록된 이름입니다.");
        }
        if (memberRepository.existsByEmail(email)) {
            throw new IllegalStateException("이미 등록된 이메일입니다.");
        }
        Member member = new Member();
        member.setName(name);
        member.setEmail(email);
        member.setPassword(passwordEncoder.encode(password));
        this.memberRepository.save(member);
        return member;
    }

    @Transactional(readOnly = true)
    public Member getMember(String name) {
        return memberRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
    }

    @Transactional
    public Member updateMember(String name, String email, String currentPassword, String newPassword) {
        Member member = getMember(name);
        verifyPassword(member, currentPassword);
        if (!member.getEmail().equals(email) && memberRepository.existsByEmail(email)) {
            throw new IllegalStateException("이미 등록된 이메일입니다.");
        }
        member.setEmail(email);
        if (newPassword != null && !newPassword.isBlank()) {
            member.setPassword(passwordEncoder.encode(newPassword));
        }
        return memberRepository.saveAndFlush(member);
    }

    @Transactional
    public void deleteMember(String name, String currentPassword) {
        Member member = getMember(name);
        verifyPassword(member, currentPassword);
        memberRepository.delete(member);
    }

    private void verifyPassword(Member member, String password) {
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
    }

}
