package com.example.aishopping.member;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    record MemberInfo(String name, String email) {
        static MemberInfo from(Member member) {
            return new MemberInfo(member.getName(), member.getEmail());
        }
    }

    record UpdateMemberRequest(
            @NotBlank @Email String email,
            @NotBlank String currentPassword,
            @Pattern(regexp = "^$|^.{8,20}$", message = "새 비밀번호는 8~20자여야 합니다.") String newPassword) {}

    record DeleteMemberRequest(@NotBlank String currentPassword) {}

    @GetMapping("/me")
    public MemberInfo me(Authentication authentication) {
        return MemberInfo.from(memberService.getMember(authentication.getName()));
    }

    @PutMapping("/me")
    public MemberInfo update(@Valid @RequestBody UpdateMemberRequest request, Authentication authentication) {
        return MemberInfo.from(memberService.updateMember(authentication.getName(), request.email(),
                request.currentPassword(), request.newPassword()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> delete(@Valid @RequestBody DeleteMemberRequest request,
                                       Authentication authentication, HttpServletRequest httpRequest,
                                       HttpServletResponse httpResponse) {
        memberService.deleteMember(authentication.getName(), request.currentPassword());
        new SecurityContextLogoutHandler().logout(httpRequest, httpResponse, authentication);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, String>> memberError(RuntimeException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validationError(MethodArgumentNotValidException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", "입력값을 확인해 주세요. 이메일과 현재 비밀번호는 필수이며 새 비밀번호는 8~20자여야 합니다."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> duplicateError() {
        return ResponseEntity.status(409).body(Map.of("message", "이미 사용 중인 정보입니다."));
    }

    @PostMapping("/signup")
    public String signup(@Valid MemberCreateForm memberCreateForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "입력 값이 유효하지 않습니다.";
        }

        if (!memberCreateForm.getPassword().equals(memberCreateForm.getPassword2())) {
            return "비밀번호가 일치하지 않습니다.";
        }
        try{
        memberService.createMember(memberCreateForm.getName(), memberCreateForm.getEmail(),memberCreateForm.getPassword());

        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
        catch (Exception e) {
            e.printStackTrace();
            return "회원가입 중 오류가 발생했습니다. "+e.getMessage();
        }
        return "회원가입이 완료되었습니다.";
    }
    @GetMapping("/login")
    public String login() {
        return "로그인 페이지";
    }

    @GetMapping("/status")
    public ResponseEntity<?> loginStatus(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of(
                    "loggedIn", true,
                    "name", authentication.getName()
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "loggedIn", false
            ));
        }
    }
}
