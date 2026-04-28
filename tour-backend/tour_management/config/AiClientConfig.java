package com.tourbooking.tour_management.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;




import java.util.Set;

@Configuration
public class AiClientConfig {

    private static final String SYSTEM_PROMPT = """
            Bạn là Trợ lý ảo thông minh của Tam Anh Travel.
            NHIỆM VỤ: Tư vấn tour, kiểm tra chỗ trống và thực hiện đặt tour.
            QUY TẮC: Bạn PHẢI tự nhìn vào kết quả JSON từ các tool để lấy đúng 'id'.
            """;

    private static final Set<String> TRAVEL_TOOLS = Set.of(
            "searchTours", "getTourDetails", "manageService", "checkSlots",
            "addToCart", "queryOrders", "manageOrder", "providerInsights",
            "manageOperations", "createTourSlot", "manageFeedback"
    );

    @Bean
    public ChatClient geminiChatClient(GoogleGenAiChatModel googleModel, ChatMemory chatMemory) {
        return ChatClient.builder(googleModel)
                .defaultSystem(SYSTEM_PROMPT)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .defaultOptions(GoogleGenAiChatOptions.builder()
                        .model(GoogleGenAiChatModel.ChatModel.GEMINI_2_5_PRO)
                        .toolNames(TRAVEL_TOOLS)
                        .temperature(0.1)
                        .build())
                .build();
    }

//    @Bean
//    public ChatClient ollamaChatClient(OllamaChatModel ollamaModel) {
//        return ChatClient.builder(ollamaModel)
//                .defaultSystem(SYSTEM_PROMPT)
//                .defaultOptions(OllamaChatOptions.builder()
//                        .toolNames(TRAVEL_TOOLS)
//                        .temperature(0.1)
//                        .build())
//                .build();
//    }
}