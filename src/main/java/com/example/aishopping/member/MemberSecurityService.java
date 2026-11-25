package com.example.aishopping.member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberSecurityService implements UserDetailsService {
  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String membername) throws UsernameNotFoundException {
    Optional<Member> _Member = this.memberRepository.findByName(membername);
    if (_Member.isEmpty()) {
      throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
    }
    Member member = _Member.get();
    List<GrantedAuthority> authorities = new ArrayList<>();
    if ("admin".equals(membername)) {
      authorities.add(new SimpleGrantedAuthority(MemberRole.ADMIN.getValue()));
    } else {
        authorities.add(new SimpleGrantedAuthority(MemberRole.MEMBER.getValue()));
    }
    return new User(member.getName(), member.getPassword(), authorities);
  }
}
