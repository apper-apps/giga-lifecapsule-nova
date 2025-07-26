class UserService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    this.initializeClient();
    this.currentUserId = 1; // Default user ID
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getProfile() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "subscriptionStatus" } },
          { field: { Name: "dailyChatCount" } },
          { field: { Name: "streakCount" } },
          { field: { Name: "xpPoints" } },
          { field: { Name: "currentLevel" } },
          { field: { Name: "badges" } }
        ]
      };

      const response = await this.apperClient.getRecordById('user_profile', this.currentUserId, params);

      if (!response.success) {
        console.error(response.message);
        // Return default user if not found
        return {
          Id: this.currentUserId,
          Name: "User",
          email: "user@example.com", 
          subscriptionStatus: "free",
          dailyChatCount: 0,
          streakCount: 0,
          xpPoints: 0,
          currentLevel: 1,
          badges: []
        };
      }

      // Handle badges field (MultiPicklist comes as comma-separated string)
      if (response.data && response.data.badges) {
        response.data.badges = response.data.badges.split(',').filter(b => b.trim());
      } else if (response.data) {
        response.data.badges = [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      // Return default user on error
      return {
        Id: this.currentUserId,
        Name: "User",
        email: "user@example.com",
        subscriptionStatus: "free", 
        dailyChatCount: 0,
        streakCount: 0,
        xpPoints: 0,
        currentLevel: 1,
        badges: []
      };
    }
  }

  async updateStreak() {
    try {
      // Get current profile
      const currentProfile = await this.getProfile();
      
      const newStreakCount = (currentProfile.streakCount || 0) + 1;
      const newXpPoints = (currentProfile.xpPoints || 0) + 20;
      const newLevel = Math.floor(newXpPoints / 100) + 1;

      // Calculate new badges
      let badges = Array.isArray(currentProfile.badges) ? [...currentProfile.badges] : [];
      if (newStreakCount === 7 && !badges.includes("Week Warrior")) {
        badges.push("Week Warrior");
      }
      if (newStreakCount === 30 && !badges.includes("Month Master")) {
        badges.push("Month Master");
      }

      const params = {
        records: [
          {
            Id: this.currentUserId,
            streakCount: newStreakCount,
            xpPoints: newXpPoints,
            currentLevel: newLevel,
            badges: badges.join(',')
          }
        ]
      };

      const response = await this.apperClient.updateRecord('user_profile', params);

      if (!response.success) {
        console.error(response.message);
        return currentProfile;
      }

      // Return updated profile
      return await this.getProfile();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating streak:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getProfile();
    }
  }

  async incrementChatCount() {
    try {
      // Get current profile
      const currentProfile = await this.getProfile();
      
      const newChatCount = (currentProfile.dailyChatCount || 0) + 1;
      const newXpPoints = (currentProfile.xpPoints || 0) + 5;
      const newLevel = Math.floor(newXpPoints / 100) + 1;

      // Calculate new badges
      let badges = Array.isArray(currentProfile.badges) ? [...currentProfile.badges] : [];
      if (newChatCount >= 5 && !badges.includes("Chat Champion")) {
        badges.push("Chat Champion");
      }

      const params = {
        records: [
          {
            Id: this.currentUserId,
            dailyChatCount: newChatCount,
            xpPoints: newXpPoints,
            currentLevel: newLevel,
            badges: badges.join(',')
          }
        ]
      };

      const response = await this.apperClient.updateRecord('user_profile', params);

      if (!response.success) {
        console.error(response.message);
        return currentProfile;
      }

      // Return updated profile
      return await this.getProfile();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error incrementing chat count:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getProfile();
    }
  }

  async addXP(amount) {
    try {
      // Get current profile
      const currentProfile = await this.getProfile();
      
      const oldLevel = currentProfile.currentLevel || 1;
      const newXpPoints = (currentProfile.xpPoints || 0) + amount;
      const newLevel = Math.floor(newXpPoints / 100) + 1;

      // Calculate new badges
      let badges = Array.isArray(currentProfile.badges) ? [...currentProfile.badges] : [];
      if (newLevel > oldLevel && !badges.includes("Level Up")) {
        badges.push("Level Up");
      }

      const params = {
        records: [
          {
            Id: this.currentUserId,
            xpPoints: newXpPoints,
            currentLevel: newLevel,
            badges: badges.join(',')
          }
        ]
      };

      const response = await this.apperClient.updateRecord('user_profile', params);

      if (!response.success) {
        console.error(response.message);
        return currentProfile;
      }

      // Return updated profile
      return await this.getProfile();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding XP:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getProfile();
    }
  }
}

export const userService = new UserService();