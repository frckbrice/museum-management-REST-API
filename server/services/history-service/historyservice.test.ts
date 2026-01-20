// tests/services/history/history-service.test.ts
import { HistoryService } from './index';
import { historyContent } from '../../../config/database/schema/tables';
import { NotFoundError, ValidationError } from '../../../middlewares/errors/error-handler';
import { eq } from 'drizzle-orm';

// Mock the database and dependencies
jest.mock('../../../config/database/schema');
jest.mock('../../../server/utils/validations/uuid-validator');
jest.mock('../../../server/utils/validations/email-validation');

describe('HistoryService', () => {
    let historyService: HistoryService;
    const mockDb = {
        query: {
            historyContent: {
                findFirst: jest.fn(),
                findMany: jest.fn(),
            },
        },
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn(),
    };

    const mockBaseService = {
        withErrorHandling: jest.fn(async (fn, methodName) => fn()),
        db: mockDb,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        historyService = new HistoryService();
        Object.assign(historyService, mockBaseService);
    });

    describe('getHistoryContentById', () => {
        it('should return history content when found', async () => {
            const mockHistory = { id: '123e4567-e89b-12d3-a456-426614174000', title: 'Test History' };
            mockDb.query.historyContent.findFirst.mockResolvedValue(mockHistory);

            const result = await historyService.getHistoryContentById('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toEqual(mockHistory);
            expect(mockDb.query.historyContent.findFirst).toHaveBeenCalledWith({
                where: eq(historyContent.id, '123e4567-e89b-12d3-a456-426614174000'),
                with: {
                    author: {
                        columns: {
                            id: true,
                            username: true,
                            email: false,
                        },
                    },
                },
            });
        });

        it('should return null when history content not found', async () => {
            mockDb.query.historyContent.findFirst.mockResolvedValue(null);
            const result = await historyService.getHistoryContentById('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toBeNull();
        });

        it('should throw ValidationError for invalid ID', async () => {
            const validateId = require('../../../server/utils/validations/uuid-validator').validateId;
            validateId.mockImplementation(() => {
                throw new ValidationError('Invalid ID');
            });

            await expect(historyService.getHistoryContentById('invalid')).rejects.toThrow(ValidationError);
        });
    });

    describe('getHistoryContentBySlug', () => {
        it('should return history content when found by slug', async () => {
            const mockHistory = { id: '123e4567-e89b-12d3-a456-426614174000', slug: 'test-history' };
            mockDb.query.historyContent.findFirst.mockResolvedValue(mockHistory);

            const result = await historyService.getHistoryContentBySlug('test-history');
            expect(result).toEqual(mockHistory);
        });

        it('should throw ValidationError for empty slug', async () => {
            await expect(historyService.getHistoryContentBySlug('')).rejects.toThrow(ValidationError);
        });
    });

    describe('getAllHistoryContent', () => {
        it('should return paginated history content', async () => {
            const mockData = [{ id: '1' }, { id: '2' }];
            const mockTotal = [{ count: 10 }];

            mockDb.query.historyContent.findMany.mockResolvedValue(mockData);
            mockDb.select.mockReturnValue({
                from: jest.fn().mockResolvedValue(mockTotal),
            });

            const result = await historyService.getAllHistoryContent(2, 0);
            expect(result.data).toEqual(mockData);
            expect(result.total).toBe(10);
            expect(result.hasMore).toBe(true);
        });

        it('should throw ValidationError for invalid limit', async () => {
            await expect(historyService.getAllHistoryContent(0)).rejects.toThrow(ValidationError);
            await expect(historyService.getAllHistoryContent(101)).rejects.toThrow(ValidationError);
        });

        it('should throw ValidationError for negative offset', async () => {
            await expect(historyService.getAllHistoryContent(10, -1)).rejects.toThrow(ValidationError);
        });
    });

    describe('createHistoryContent', () => {
        const validData = {
            title: 'New History',
            content: 'Content',
            authorId: 'user-123',
            metaDescription: 'meta',
            keywords: 'keywords',
        };

        it('should create new history content', async () => {
            const mockCreated = { ...validData, id: 'new-id' };
            mockDb.insert.mockReturnThis();
            mockDb.values.mockReturnThis();
            mockDb.returning.mockResolvedValue([mockCreated]);
            mockDb.query.historyContent.findFirst.mockResolvedValue(null);

            const result = await historyService.createHistoryContent({
                ...validData,
                id: 'test-id',
                slug: 'new-history',
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                authorId: validData.authorId,
            });
            expect(result).toEqual(mockCreated);
        });

        it('should throw ValidationError for missing required fields', async () => {
            await expect(historyService.createHistoryContent({} as any)).rejects.toThrow(ValidationError);
        });

        it('should append timestamp to slug if duplicate exists', async () => {
            const mockExisting = { id: 'existing' };
            mockDb.query.historyContent.findFirst.mockResolvedValueOnce(mockExisting).mockResolvedValueOnce(null);

            const mockCreated = { ...validData, id: 'new-id', slug: 'new-history-123456' };
            mockDb.returning.mockResolvedValue([mockCreated]);

            const result = await historyService.createHistoryContent({
                ...validData,
                slug: 'new-history',
                id: 'test-id',
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                authorId: validData.authorId,
            });
            expect(result.slug).toMatch(/new-history-\d+/);
        });
    });

    // Update this in your test file (history-service.test.ts)

    describe('updateHistoryContent', () => {
        const validUpdate = { title: 'Updated Title' };
        const validId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID format
        const invalidId = 'invalid-id';

        // Mock the validateId function properly
        const mockValidateId = jest.spyOn(
            require('../../../server/utils/validations/uuid-validator'),
            'validateId'
        );

        beforeEach(() => {
            // Reset mocks before each test
            mockValidateId.mockImplementation(() => { }); // Default mock does nothing
        });

        it('should update existing history content', async () => {
            // Setup
            const mockExisting = {
                id: validId,
                title: 'Original'
            };
            const mockUpdated = {
                ...mockExisting,
                ...validUpdate
            };

            mockDb.query.historyContent.findFirst.mockResolvedValue(mockExisting);
            mockDb.update.mockReturnThis();
            mockDb.set.mockReturnThis();
            mockDb.where.mockReturnThis();
            mockDb.returning.mockResolvedValue([mockUpdated]);

            // Test
            const result = await historyService.updateHistoryContent(validId, validUpdate);

            // Verify
            expect(result).toEqual(mockUpdated);
            expect(mockValidateId).toHaveBeenCalledWith(validId, 'history content id');
            // More detailed verification

        });

        it('should throw NotFoundError for non-existent content', async () => {
            mockDb.query.historyContent.findFirst.mockResolvedValue(null);
            await expect(historyService.updateHistoryContent(validId, validUpdate))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw ValidationError for empty update data', async () => {
            await expect(historyService.updateHistoryContent(validId, {}))
                .rejects.toThrow(ValidationError);
        });

        // it('should throw ValidationError for invalid ID', async () => {
        //     const invalidId = 'invalid-id';
        //     mockValidateId.mockImplementation(() => {
        //         throw new ValidationError('Invalid ID');
        //     });

        //     await expect(historyService.updateHistoryContent(invalidId, validUpdate))
        //         .rejects.toThrow(ValidationError);
        // });
        it('should throw ValidationError for invalid ID', async () => {
            const invalidId = 'invalid-id';
            const validUpdate = { title: 'Updated Title' };

            await expect(historyService.updateHistoryContent(invalidId, validUpdate))
                .rejects.toThrow(ValidationError);

            // More detailed verification
            try {
                await historyService.updateHistoryContent(invalidId, validUpdate);
                fail('Should have thrown');
            } catch (error: any) {
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.message).toContain('Invalid ID');
            }
        });
    });

    describe('deleteHistoryContent', () => {
        const validId = '123e4567-e89b-12d3-a456-426614174000';

        it('should throw NotFoundError for non-existent content', async () => {
            mockDb.query.historyContent.findFirst.mockResolvedValue(null);

            // Option 1: Simple check
            await expect(historyService.deleteHistoryContent(validId))
                .rejects.toThrow(NotFoundError);

            // Option 2: Detailed check
            try {
                await historyService.deleteHistoryContent(validId);
                fail('Should have thrown');
            } catch (error: any) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toContain('History content');
                expect(error.message).toContain(validId);
            }
        });
    });
});
