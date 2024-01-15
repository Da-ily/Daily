package com.daily.daily.member.domain;

import com.daily.daily.common.domain.BaseTimeEntity;
import com.daily.daily.member.constant.MemberRole;
import com.daily.daily.oauth.constant.SocialType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String email;
    @Enumerated(EnumType.STRING)
    private MemberRole role;
    private String socialId;
    @Enumerated(EnumType.STRING)
    private SocialType socialType;

    public void initializeNickname() {
        if (nickname == null) {
            nickname = String.format("다일리%d", id);
        }
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateEmail(String email) {
        this.email = email;
    }

    public boolean isNotSocialLoginMember() {
        return socialType == SocialType.NONE;
    }

    public boolean hasSameUsername(String otherUsername) {
        return username.equals(otherUsername);
    }
}
