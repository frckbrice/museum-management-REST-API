import { ValidationError } from "../../../middlewares/errors/error-handler"

// UUID validation patterns
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_GENERAL_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_NIL = '00000000-0000-0000-0000-000000000000';
const UUID_MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

/**
 * UUID validation utilities
 */
export class UUIDValidator {
    /**
     * Validates if a string is a valid UUID (any version)
     */
    static isValidUUID(uuid: string): boolean {
        if (!uuid || typeof uuid !== 'string') {
            return false;
        }

        // Remove any whitespace
        const cleanUuid = uuid.trim();

        // Check format
        return UUID_GENERAL_REGEX.test(cleanUuid);
    }

    /**
     * Validates if a string is a valid UUID v4
     */
    static isValidUUIDv4(uuid: string): boolean {
        if (!uuid || typeof uuid !== 'string') {
            return false;
        }

        const cleanUuid = uuid.trim();
        return UUID_V4_REGEX.test(cleanUuid);
    }

    /**
     * Validates and normalizes a UUID string
     */
    static validateAndNormalize(uuid: string, fieldName: string = 'id'): string {
        if (!uuid || typeof uuid !== 'string') {
            throw new ValidationError(`${fieldName} must be a non-empty string`);
        }

        const cleanUuid = uuid.trim().toLowerCase();

        if (!this.isValidUUID(cleanUuid)) {
            throw new ValidationError(`Invalid ${fieldName} format. Must be a valid UUID`);
        }

        // Check for nil UUID (all zeros)
        if (cleanUuid === UUID_NIL) {
            throw new ValidationError(`${fieldName} cannot be a nil UUID`);
        }

        return cleanUuid;
    }

    /**
     * Validates multiple UUIDs at once
     */
    static validateMultiple(uuids: string[], fieldName: string = 'ids'): string[] {
        if (!Array.isArray(uuids)) {
            throw new ValidationError(`${fieldName} must be an array`);
        }

        if (uuids.length === 0) {
            throw new ValidationError(`${fieldName} array cannot be empty`);
        }

        if (uuids.length > 100) {
            throw new ValidationError(`${fieldName} array cannot contain more than 100 items`);
        }

        const validatedUuids: string[] = [];
        const seenUuids = new Set<string>();

        for (let i = 0; i < uuids.length; i++) {
            const uuid = this.validateAndNormalize(uuids[i], `${fieldName}[${i}]`);

            // Check for duplicates
            if (seenUuids.has(uuid)) {
                throw new ValidationError(`Duplicate UUID found in ${fieldName}: ${uuid}`);
            }

            seenUuids.add(uuid);
            validatedUuids.push(uuid);
        }

        return validatedUuids;
    }

    /**
     * Extracts UUID version from a valid UUID
     */
    static getVersion(uuid: string): number | null {
        if (!this.isValidUUID(uuid)) {
            return null;
        }

        const versionChar = uuid.charAt(14);
        return parseInt(versionChar, 10);
    }

    /**
     * Checks if UUID is nil (all zeros)
     */
    static isNilUUID(uuid: string): boolean {
        return uuid.trim().toLowerCase() === UUID_NIL;
    }

    /**
     * Checks if UUID is max (all f's)
     */
    static isMaxUUID(uuid: string): boolean {
        return uuid.trim().toLowerCase() === UUID_MAX;
    }

    /**
     * Generates a random UUID v4 (requires crypto module)
     */
    static generateV4(): string {

        try {

            return crypto.randomUUID();
        } catch (error) {
            // Fallback implementation
            return this.generateV4Fallback();
        }


        // For browser environment
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback implementation
        return this.generateV4Fallback();
    }

    /**
     * Fallback UUID v4 generator
     */
    private static generateV4Fallback(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Converts UUID to different formats
     */
    static format(uuid: string, format: 'uppercase' | 'lowercase' | 'canonical' = 'lowercase'): string {
        const validUuid = this.validateAndNormalize(uuid);

        switch (format) {
            case 'uppercase':
                return validUuid.toUpperCase();
            case 'lowercase':
                return validUuid.toLowerCase();
            case 'canonical':
                return validUuid.toLowerCase();
            default:
                return validUuid;
        }
    }

    /**
     * Compares two UUIDs for equality (case-insensitive)
     */
    static equals(uuid1: string, uuid2: string): boolean {
        try {
            const normalized1 = this.validateAndNormalize(uuid1);
            const normalized2 = this.validateAndNormalize(uuid2);
            return normalized1 === normalized2;
        } catch {
            return false;
        }
    }
}

/**
 * Convenience functions for common UUID operations
 */

/**
 * Validates a single UUID ID
 */
export const validateId = (id: string, fieldName: string = 'id'): string => {
    return UUIDValidator.validateAndNormalize(id, fieldName);
};

/**
 * Validates multiple UUID IDs
 */
export const validateIds = (ids: string[], fieldName: string = 'ids'): string[] => {
    return UUIDValidator.validateMultiple(ids, fieldName);
};

/**
 * Quick UUID validation check
 */
export const isValidUUID = (uuid: string): boolean => {
    return UUIDValidator.isValidUUID(uuid);
};

/**
 * Quick UUID v4 validation check
 */
export const isValidUUIDv4 = (uuid: string): boolean => {
    return UUIDValidator.isValidUUIDv4(uuid);
};

/**
 * Generate a new UUID v4
 */
export const generateUUID = (): string => {
    return UUIDValidator.generateV4();
};

/**
 * Normalize UUID to lowercase
 */
export const normalizeUUID = (uuid: string): string => {
    return UUIDValidator.validateAndNormalize(uuid);
};

/**
 * Type guard for UUID validation
 */
export const isUUID = (value: any): value is string => {
    return typeof value === 'string' && UUIDValidator.isValidUUID(value);
};

/**
 * Custom validation decorator for class-validator (if using)
 */
export const IsUUID = (version?: 'all' | '4', options?: { message?: string }) => {
    return (target: any, propertyName: string) => {
        // This would integrate with class-validator if you're using it
        // Implementation depends on your validation library
    };
};

/**
 * UUID validation middleware for Express routes
 */
export const validateUUIDParam = (paramName: string) => {
    return (req: any, res: any, next: any) => {
        try {
            const uuid = req.params[paramName];
            req.params[paramName] = validateId(uuid, paramName);
            next();
        } catch (error) {
            res.status(400).json({
                error: 'Invalid parameter',
                message: error instanceof Error ? error.message : 'Invalid UUID format'
            });
        }
    };
};

/**
 * UUID validation for query parameters
 */
export const validateUUIDQuery = (queryName: string, required: boolean = false) => {
    return (req: any, res: any, next: any) => {
        try {
            const uuid = req.query[queryName];

            if (!uuid && required) {
                return res.status(400).json({
                    error: 'Missing required parameter',
                    message: `${queryName} is required`
                });
            }

            if (uuid) {
                req.query[queryName] = validateId(uuid as string, queryName);
            }

            next();
        } catch (error) {
            res.status(400).json({
                error: 'Invalid query parameter',
                message: error instanceof Error ? error.message : 'Invalid UUID format'
            });
        }
    };
};

/**
 * Batch UUID validation for arrays
 */
export const validateUUIDBatch = (uuids: unknown[]): string[] => {
    if (!Array.isArray(uuids)) {
        throw new ValidationError('Expected an array of UUIDs');
    }

    return uuids.map((uuid, index) => {
        if (typeof uuid !== 'string') {
            throw new ValidationError(`Item at index ${index} is not a string`);
        }
        return validateId(uuid, `item[${index}]`);
    });
};

/**
 * UUID validation with custom error messages
 */
export const validateIdWithMessage = (
    id: string,
    fieldName: string = 'id',
    customMessage?: string
): string => {
    try {
        return validateId(id, fieldName);
    } catch (error) {
        if (customMessage && error instanceof ValidationError) {
            throw new ValidationError(customMessage);
        }
        throw error;
    }
};


// Example usage and tests
export const UUIDValidatorTests = {
    runTests: () => {
        console.log('Running UUID validation tests...');

        // Test valid UUIDs
        const validUUIDs = [
            '123e4567-e89b-12d3-a456-426614174000',
            '550e8400-e29b-41d4-a716-446655440000',
            'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        ];

        validUUIDs.forEach(uuid => {
            console.assert(isValidUUID(uuid), `Should be valid: ${uuid}`);
        });

        // Test invalid UUIDs
        const invalidUUIDs = [
            'invalid-uuid',
            '123e4567-e89b-12d3-a456',
            '123e4567-e89b-12d3-a456-426614174000-extra',
            '',
            null,
            undefined
        ];

        invalidUUIDs.forEach(uuid => {
            console.assert(!isValidUUID(uuid as string), `Should be invalid: ${uuid}`);
        });

        console.log('UUID validation tests completed!');
    }
};
