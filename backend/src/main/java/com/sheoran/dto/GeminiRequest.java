package com.sheoran.dto;

import java.util.List;
import java.util.ArrayList;

public class GeminiRequest {

    private List<Content> contents = new ArrayList<>();

    // ✅ Getter
    public List<Content> getContents() {
        return contents;
    }

    // ✅ Setter
    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    // ================= INNER CLASSES =================

    public static class Content {
        private List<Part> parts = new ArrayList<>();

        public List<Part> getParts() {
            return parts;
        }

        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
    }

    public static class Part {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}