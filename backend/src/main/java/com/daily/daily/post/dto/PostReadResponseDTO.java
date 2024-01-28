package com.daily.daily.post.dto;

import com.daily.daily.member.domain.Member;
import com.daily.daily.post.domain.Post;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PostReadResponseDTO {
    private Long postId;
    private String content;
    private String pageImage;
    private Long writerId;
    private String writerNickname;
    private Set<String> hashtags;
    private Long likeCount;
    private LocalDateTime createdTime;

    public static PostReadResponseDTO from(Post post, Long likeCount) {
        Member postWriter = post.getPostWriter();

        return PostReadResponseDTO.builder()
                .postId(post.getId())
                .content(post.getContent())
                .pageImage(post.getPageImage())
                .writerId(postWriter.getId())
                .writerNickname(postWriter.getNickname())
                .hashtags(post.getTagNames())
                .createdTime(post.getCreatedTime())
                .likeCount(likeCount)
                .build();
    }
}

