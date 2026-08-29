package com.example.aishopping.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public String signup(@Valid MemberCreateForm memberCreateForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "입력 값이 유효하지 않습니다.";
        }

        if (!memberCreateForm.getPassword().equals(memberCreateForm.getPassword2())) {
            return "비밀번호가 일치하지 않습니다.";
        }
        try{
        memberService.createMember(memberCreateForm.getName(), memberCreateForm.getPassword());

        } catch (DataIntegrityViolationException e) {
            return "이미 등록된 사용자입니다.";
        }
        catch (Exception e) {
            return "회원가입 중 오류가 발생했습니다.";
        }
        return "회원가입이 완료되었습니다.";
    }
}
