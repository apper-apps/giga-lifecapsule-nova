class ChatService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "message" } },
          { field: { Name: "response" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "userId" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('chat_message', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform chat messages into alternating user/AI format
      const chatData = response.data || [];
      const formattedMessages = chatData.flatMap(chat => [
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

      return formattedMessages;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching chat messages:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(chatData) {
    try {
      const params = {
        records: [
          {
            Name: chatData.message?.substring(0, 50) || "Chat",
            message: chatData.message,
            response: chatData.response,
            timestamp: chatData.timestamp,
            userId: 1
          }
        ]
      };

      const response = await this.apperClient.createRecord('chat_message', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create chat message ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating chat message:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
}

export const chatService = new ChatService();