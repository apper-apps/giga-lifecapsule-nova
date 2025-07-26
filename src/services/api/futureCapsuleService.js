class FutureCapsuleService {
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
          { field: { Name: "unlockDate" } },
          { field: { Name: "isUnlocked" } },
          { field: { Name: "userId" } }
        ],
        orderBy: [
          {
            fieldName: "unlockDate",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('future_capsule', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching future capsules:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "message" } },
          { field: { Name: "unlockDate" } },
          { field: { Name: "isUnlocked" } },
          { field: { Name: "userId" } }
        ]
      };

      const response = await this.apperClient.getRecordById('future_capsule', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching capsule with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(capsuleData) {
    try {
      const params = {
        records: [
          {
            Name: capsuleData.message?.substring(0, 50) || "Future Capsule",
            message: capsuleData.message,
            unlockDate: capsuleData.unlockDate,
            isUnlocked: false,
            userId: 1
          }
        ]
      };

      const response = await this.apperClient.createRecord('future_capsule', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create future capsule ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating future capsule:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async unlock(id) {
    try {
      // First get the capsule to check unlock date
      const capsule = await this.getById(id);
      if (!capsule) {
        throw new Error("Capsule not found");
      }

      const unlockDate = new Date(capsule.unlockDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (unlockDate > today) {
        throw new Error("Capsule is not ready to unlock yet");
      }

      // Update the capsule to mark as unlocked
      const params = {
        records: [
          {
            Id: parseInt(id),
            isUnlocked: true
          }
        ]
      };

      const response = await this.apperClient.updateRecord('future_capsule', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to unlock capsule ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error unlocking capsule:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updateData.message?.substring(0, 50) || "Future Capsule",
            message: updateData.message,
            unlockDate: updateData.unlockDate,
            isUnlocked: updateData.isUnlocked !== undefined ? updateData.isUnlocked : false
          }
        ]
      };

      const response = await this.apperClient.updateRecord('future_capsule', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update future capsule ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating future capsule:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('future_capsule', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete future capsule ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting future capsule:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const futureCapsuleService = new FutureCapsuleService();