class MemoryService {
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
          { field: { Name: "Tags" } },
          { field: { Name: "text" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "mood" } },
          { field: { Name: "userId" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('memory', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching memories:", error?.response?.data?.message);
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
          { field: { Name: "Tags" } },
          { field: { Name: "text" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "mood" } },
          { field: { Name: "userId" } }
        ]
      };

      const response = await this.apperClient.getRecordById('memory', id, params);

if (!response.success) {
        console.error(response.message);
        // Check for specific "Record does not exist" error and provide user feedback
        if (response.message && response.message.includes("Record does not exist")) {
          const { toast } = await import("react-toastify");
          toast.error("Memory not found. It may have been deleted or doesn't exist.");
        }
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching memory with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(memoryData) {
    try {
      const params = {
        records: [
          {
            Name: memoryData.text?.substring(0, 50) || "Memory",
            Tags: Array.isArray(memoryData.tags) ? memoryData.tags.join(",") : "",
            text: memoryData.text,
            timestamp: memoryData.timestamp,
            mood: memoryData.mood || "",
            userId: 1
          }
        ]
      };

      const response = await this.apperClient.createRecord('memory', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create memory ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating memory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updateData.text?.substring(0, 50) || "Memory",
            Tags: Array.isArray(updateData.tags) ? updateData.tags.join(",") : updateData.Tags || "",
            text: updateData.text,
            timestamp: updateData.timestamp,
            mood: updateData.mood || ""
          }
        ]
      };

      const response = await this.apperClient.updateRecord('memory', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update memory ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating memory:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord('memory', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete memory ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting memory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const memoryService = new MemoryService();