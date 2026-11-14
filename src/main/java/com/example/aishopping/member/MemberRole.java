package com.example.aishopping.member;

import lombok.Getter;

@Getter
public enum MemberRole {
    MEMBER("ROLE_MEMBER"),
    ADMIN("ROLE_ADMIN");

    MemberRole(String value) {
        this.value = value;
    }

    private String value;
}
