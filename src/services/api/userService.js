import userData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...userData];
    this.currentUserId = 1; // Simulating logged-in user
  }

  async getProfile() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === this.currentUserId);
        resolve(user || this.users[0]);
      }, 300);
    });
  }

  async updateStreak() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === this.currentUserId);
        if (user) {
          user.streakCount += 1;
          user.xpPoints += 20; // XP for maintaining streak
          user.currentLevel = Math.floor(user.xpPoints / 100) + 1;
          
          // Award badges based on streak
          if (user.streakCount === 7 && !user.badges.includes("Week Warrior")) {
            user.badges.push("Week Warrior");
          }
          if (user.streakCount === 30 && !user.badges.includes("Month Master")) {
            user.badges.push("Month Master");
          }
        }
        resolve(user || this.users[0]);
      }, 200);
    });
  }

  async incrementChatCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === this.currentUserId);
        if (user) {
          user.dailyChatCount += 1;
          user.xpPoints += 5; // XP for chatting
          user.currentLevel = Math.floor(user.xpPoints / 100) + 1;
          
          // Award chat badge
          if (user.dailyChatCount >= 5 && !user.badges.includes("Chat Champion")) {
            user.badges.push("Chat Champion");
          }
        }
        resolve(user || this.users[0]);
      }, 200);
    });
  }

  async addXP(amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === this.currentUserId);
        if (user) {
          const oldLevel = user.currentLevel;
          user.xpPoints += amount;
          user.currentLevel = Math.floor(user.xpPoints / 100) + 1;
          
          // Award level up badge
          if (user.currentLevel > oldLevel && !user.badges.includes("Level Up")) {
            user.badges.push("Level Up");
          }
        }
        resolve(user || this.users[0]);
      }, 200);
    });
  }
}

export const userService = new UserService();