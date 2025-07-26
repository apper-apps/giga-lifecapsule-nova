import capsulesData from "@/services/mockData/futureCapsules.json";

class FutureCapsuleService {
  constructor() {
    this.capsules = [...capsulesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.capsules]);
      }, 350);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const capsule = this.capsules.find(c => c.Id === parseInt(id));
        if (capsule) {
          resolve({ ...capsule });
        } else {
          reject(new Error("Capsule not found"));
        }
      }, 300);
    });
  }

  async create(capsuleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCapsule = {
          Id: Math.max(...this.capsules.map(c => c.Id), 0) + 1,
          userId: "1",
          message: capsuleData.message,
          unlockDate: capsuleData.unlockDate,
          isUnlocked: false
        };
        
        this.capsules.push(newCapsule);
        resolve({ ...newCapsule });
      }, 450);
    });
  }

  async unlock(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const capsule = this.capsules.find(c => c.Id === parseInt(id));
        if (capsule) {
          const unlockDate = new Date(capsule.unlockDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (unlockDate <= today) {
            capsule.isUnlocked = true;
            resolve({ ...capsule });
          } else {
            reject(new Error("Capsule is not ready to unlock yet"));
          }
        } else {
          reject(new Error("Capsule not found"));
        }
      }, 400);
    });
  }

  async update(id, updateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.capsules.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.capsules[index] = {
            ...this.capsules[index],
            ...updateData,
            Id: parseInt(id)
          };
          resolve({ ...this.capsules[index] });
        } else {
          reject(new Error("Capsule not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.capsules.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.capsules.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Capsule not found"));
        }
      }, 300);
    });
  }
}

export const futureCapsuleService = new FutureCapsuleService();