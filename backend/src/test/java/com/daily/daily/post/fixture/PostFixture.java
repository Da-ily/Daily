package com.daily.daily.post.fixture;

import com.daily.daily.member.domain.Member;
import com.daily.daily.post.domain.Hashtag;
import com.daily.daily.post.domain.Post;
import com.daily.daily.post.domain.PostHashtag;
import com.daily.daily.post.dto.PostReadResponseDTO;
import com.daily.daily.post.dto.PostWriteRequestDTO;
import com.daily.daily.post.dto.PostWriteResponseDTO;
import org.springframework.mock.web.MockMultipartFile;
import org.testcontainers.shaded.com.fasterxml.jackson.core.JsonProcessingException;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import static com.daily.daily.member.fixture.MemberFixture.일반회원1;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

public class PostFixture {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    public static final Long POST_ID = 31L;
    private static final String POST_CONTENT = "오늘 저의 다일리입니다.";
    private static final String PAGE_IMAGE_URL = "imageURL";
    private static final LocalDateTime POST_CREATED_TIME = LocalDateTime.of(2024,1,18,15,38,32,42);
    private static final List<String> HASHTAG_NAMES = List.of("일반", "음식", "대학생");
    private static final List<Hashtag> HASHTAGS = HASHTAG_NAMES.stream()
            .map(Hashtag::of)
            .toList();

    public static PostWriteRequestDTO 게시글_요청_DTO() {
        return new PostWriteRequestDTO(POST_CONTENT, new HashSet<>(HASHTAG_NAMES));
    }

    public static PostWriteResponseDTO 게시글_작성_응답_DTO() {
        Member member = 일반회원1();

        return PostWriteResponseDTO.builder()
                .postId(POST_ID)
                .content(POST_CONTENT)
                .pageImage(PAGE_IMAGE_URL)
                .writerId(member.getId())
                .writerNickname(member.getNickname())
                .hashtags(HASHTAG_NAMES)
                .createdTime(POST_CREATED_TIME)
                .build();
    }

    public static PostReadResponseDTO 게시글_단건_조회_DTO() {
        PostWriteResponseDTO 게시글_작성_응답_DTO = 게시글_작성_응답_DTO();

        return PostReadResponseDTO.builder()
                .postId(게시글_작성_응답_DTO.getPostId())
                .content(게시글_작성_응답_DTO.getContent())
                .pageImage(게시글_작성_응답_DTO.getPageImage())
                .writerId(게시글_작성_응답_DTO.getWriterId())
                .writerNickname(게시글_작성_응답_DTO.getWriterNickname())
                .hashtags(게시글_작성_응답_DTO.getHashtags())
                .createdTime(게시글_작성_응답_DTO.getCreatedTime())
                .likeCount(10L)
                .build();
    }

    public static MockMultipartFile 다일리_페이지_이미지_파일() {
        return new MockMultipartFile(
                "pageImage",
                "dailryPage.png",
                IMAGE_PNG_VALUE,
                "dailryPage".getBytes()
        );
    }

    public static MockMultipartFile 게시글_요청_DTO_JSON_파일() throws JsonProcessingException {
        return new MockMultipartFile(
                "request",
                "request",
                APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(게시글_요청_DTO())
        );
    }

    public static Post 일반회원1이_작성한_게시글() {
        Post post = Post.builder()
                .id(3L)
                .content(POST_CONTENT)
                .pageImage(PAGE_IMAGE_URL)
                .postWriter(일반회원1())
                .build();

        HASHTAGS.forEach(hashtag -> post.addPostHashtag(PostHashtag.of(post, hashtag)));

        return post;
    }
}
