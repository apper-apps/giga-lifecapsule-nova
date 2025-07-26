import memoriesData from "@/services/mockData/memories.json";

class MemoryService {
  constructor() {
    this.memories = [...memoriesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.memories]);
      }, 400);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const memory = this.memories.find(m => m.Id === parseInt(id));
        if (memory) {
          resolve({ ...memory });
        } else {
          reject(new Error("Memory not found"));
        }
      }, 300);
    });
  }

  async create(memoryData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMemory = {
          Id: Math.max(...this.memories.map(m => m.Id), 0) + 1,
          userId: "1",
          text: memoryData.text,
          timestamp: memoryData.timestamp,
          tags: memoryData.tags || [],
          mood: memoryData.mood || ""
        };
        
        this.memories.unshift(newMemory);
        resolve({ ...newMemory });
      }, 500);
    });
  }

  async update(id, updateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.memories.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          this.memories[index] = {
            ...this.memories[index],
            ...updateData,
            Id: parseInt(id)
          };
          resolve({ ...this.memories[index] });
        } else {
          reject(new Error("Memory not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.memories.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.memories.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Memory not found"));
        }
      }, 300);
    });
  }
}

export const memoryService = new MemoryService();