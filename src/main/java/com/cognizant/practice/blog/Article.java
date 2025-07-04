package com.cognizant.practice.blog;

import java.time.LocalDateTime;

public record Article (int id, String title, String content, LocalDateTime createdDate, LocalDateTime updatedDate){
}
