import { commonResponse, CommonResponse } from './output-message';

describe('Output Message Utilities', () => {
  describe('commonResponse', () => {
    it('should create a successful response with data', () => {
      const result = commonResponse(true, 'Operation succeeded', { id: 1 });

      const expected: CommonResponse<{ id: number }> = {
        success: true,
        message: 'Operation succeeded',
        data: { id: 1 },
      };

      expect(result).toEqual(expected);
    });

    it('should create an error response', () => {
      const result = commonResponse(false, 'Operation failed', null);

      const expected: CommonResponse<null> = {
        success: false,
        message: 'Operation failed',
        data: null,
      };

      expect(result).toEqual(expected);
    });
  });
});
