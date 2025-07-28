package com.cognizant.practice.blog.articles.model;

import java.util.UUID;

public record ArticleRequest(String title, String content) {

    public String generateSummary() {
        if (this.content == null) return "";
            return this.content.length() <= 500 ? this.content :
                this.content.substring(0, 500) + "...";
    }

}
