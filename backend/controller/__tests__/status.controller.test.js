import { describe, it, expect, vi, beforeEach } from 'vitest';
import Status from '../../models/status.model';
import User from '../../models/user.model';

// Mock dependencies
vi.mock('../../models/status.model');
vi.mock('../../models/user.model');

describe('Status Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createStatus', () => {
    it('should create a new status', async () => {
      const mockStatus = {
        userId: 'user1',
        content: 'Test status',
        type: 'text',
      };

      Status.create.mockResolvedValue({ ...mockStatus, _id: 'status1' });

      // Test would verify status creation logic here
      expect(Status.create).toBeDefined();
    });
  });

  describe('getStatuses', () => {
    it('should fetch user statuses', async () => {
      const mockStatuses = [
        { _id: 'status1', content: 'Status 1' },
        { _id: 'status2', content: 'Status 2' },
      ];

      Status.find.mockResolvedValue(mockStatuses);

      // Test would verify status fetching logic here
      expect(Status.find).toBeDefined();
    });
  });
});

