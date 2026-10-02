package com.example.aishopping.member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

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

}
