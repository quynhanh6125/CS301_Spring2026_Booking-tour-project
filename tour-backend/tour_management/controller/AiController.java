package com.tourbooking.tour_management.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    //private final ChatClient ollamaAgent;
    private final ChatClient geminiAgent;
    private final ChatMemory chatMemory; // 1. Thêm cái này để có quyền "xóa não" AI

    public AiController(/*@Qualifier("ollamaChatClient") ChatClient ollamaAgent,*/
                        @Qualifier("geminiChatClient") ChatClient geminiAgent,
                        ChatMemory chatMemory) { // 2. Inject vào Constructor
        //this.ollamaAgent = ollamaAgent;
        this.geminiAgent = geminiAgent;
        this.chatMemory = chatMemory;
    }

    @GetMapping("/chat")
    public String chat(
            @RequestParam(value = "message") String message,
            @RequestParam(value = "userId", defaultValue = "GUEST") String userId,
            @RequestParam(value = "role", defaultValue = "CUSTOMER") String role
            /*@RequestParam(value = "mode", defaultValue = "gemini") String mode*/){

        ChatClient activeAgent = geminiAgent;

//        ChatClient activeAgent = mode.equalsIgnoreCase("ollama") ? geminiAgent : ollamaAgent;
        String userContext = String.format("\n[Ngữ cảnh hệ thống: Người dùng ID=%s, vai trò=%s]", userId, role);

        try {
            // Thử chạy bình thường với trí nhớ
            return activeAgent.prompt()
                    .user(message + userContext)
                    .advisors(advisor -> advisor.param(ChatMemory.CONVERSATION_ID, userId))
                    .call()
                    .content();

        } catch (Exception e) {
            // 3. KHI AI "LĂN RA CHẾT":
            System.err.println("Phát hiện lỗi bộ nhớ với User " + userId + ": " + e.getMessage());

            // Lập tức xóa cái "sổ tay" đang bị hỏng JSON của User này
            chatMemory.clear(userId);

            // Thử gọi lại AI một lần nữa (lần này trí nhớ sạch nên sẽ không bị lỗi parse JSON)
            return "Dạ, bộ nhớ hội thoại vừa được làm mới do gặp sự cố kỹ thuật. Bạn hỏi lại giúp mình nhé!\n\n" +
                    activeAgent.prompt()
                            .user(message + userContext)
                            .call() // Gọi trơn, không dùng advisor lần này cho chắc
                            .content();
        }
    }

    // Bonus: API để bạn chủ động xóa trí nhớ khi cần test
//    @DeleteMapping("/chat/clear")
//    public String clear(@RequestParam String userId) {
//        chatMemory.clear(userId);
//        return "Đã dọn dẹp bộ nhớ cho " + userId;
//    }
}