package com.daily.daily.oauth.service;

import com.daily.daily.member.domain.Member;
import com.daily.daily.member.repository.MemberRepository;
import com.daily.daily.member.service.NicknameGenerator;
import com.daily.daily.oauth.OAuth2CustomUser;
import com.daily.daily.oauth.OAuthAttributes;
import com.daily.daily.oauth.constant.SocialType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;
    private final NicknameGenerator nicknameGenerator;

    OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService.loadUser() 실행 - OAuth2 로그인 요청 진입");

        OAuth2User oAuth2User = oAuth2UserService.loadUser(oAuth2UserRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        SocialType socialType = SocialType.getSocialType(registrationId);
        String userNameAttributeName = oAuth2UserRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        OAuthAttributes extractAttributes = OAuthAttributes.of(socialType, userNameAttributeName, oAuth2User.getAttributes());
        Member member = memberRepository.findBySocialTypeAndSocialId(socialType, extractAttributes.getOauth2UserInfo().getId())
                .orElseGet(() -> saveMember(extractAttributes, socialType));

        return new OAuth2CustomUser(
                Collections.singleton(new SimpleGrantedAuthority(member.getRole().name())),
                attributes,
                extractAttributes.getNameAttributeKey(),
                member
        );
    }

    private Member saveMember(OAuthAttributes attributes, SocialType socialType) {
        Member createdUser = attributes.toEntity(socialType, attributes.getOauth2UserInfo());
        createdUser.updateNickname(nicknameGenerator.generateRandomNickname());
        return memberRepository.save(createdUser);
    }
}
