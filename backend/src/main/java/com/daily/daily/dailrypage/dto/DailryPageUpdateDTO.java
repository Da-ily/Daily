package com.daily.daily.dailrypage.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DailryPageUpdateDTO {
    private String background;
    private List<ElementDTO> elements;

    @Getter
    @Setter
    @ToString
    public static class ElementDTO {
        private String id;
        private String type;
        private int order;
        private PositionDTO position;
        private String rotation;
        private Map<String, Object> properties;

        @Getter
        @Setter
        static class PositionDTO {
            private int x;
            private int y;
        }
    }
}

