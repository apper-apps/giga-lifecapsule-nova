import chatData from "@/services/mockData/chatMessages.json";

class ChatService {
  constructor() {
    this.messages = [...chatData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formattedMessages = this.messages.flatMap(chat => [
          {
            Id: chat.Id * 2 - 1,
            message: chat.message,
            timestamp: chat.timestamp,
            isUser: true
          },
          {
            Id: chat.Id * 2,
            message: chat.response,
            timestamp: new Date(new Date(chat.timestamp).getTime() + 30000).toISOString(),
            isUser: false
          }
        ]);
        resolve(formattedMessages);
      }, 300);
    });
  }

  async create(chatData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newChat = {
          Id: Math.max(...this.messages.map(m => m.Id), 0) + 1,
          userId: "1",
          message: chatData.message,
          response: chatData.response,
          timestamp: chatData.timestamp
        };
        
        this.messages.push(newChat);
        resolve({ ...newChat });
      }, 400);
    });
  }
}

export const chatService = new ChatService();