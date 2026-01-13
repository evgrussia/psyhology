import { describe, it, expect } from 'vitest';
import { AuditDataSanitizer } from './AuditDataSanitizer';

describe('AuditDataSanitizer', () => {
  describe('sanitize', () => {
    it('должен удалять P2 поля (email, phone)', () => {
      const data = {
        id: '123',
        email: 'test@example.com',
        phone: '+79991234567',
        name: 'Test Service',
        price: 1000,
      };

      const sanitized = AuditDataSanitizer.sanitize(data);

      expect(sanitized).not.toBeNull();
      expect(sanitized).not.toHaveProperty('email');
      expect(sanitized).not.toHaveProperty('phone');
      expect(sanitized).toHaveProperty('id', '123');
      expect(sanitized).toHaveProperty('name', 'Test Service');
      expect(sanitized).toHaveProperty('price', 1000);
    });

    it('должен удалять длинные текстовые поля (P2)', () => {
      const data = {
        id: '123',
        title: 'Service Title',
        description: 'A'.repeat(300), // Длинный текст
        price: 1000,
      };

      const sanitized = AuditDataSanitizer.sanitize(data);

      expect(sanitized).not.toBeNull();
      expect(sanitized).not.toHaveProperty('description');
      expect(sanitized).toHaveProperty('id', '123');
      expect(sanitized).toHaveProperty('title', 'Service Title');
      expect(sanitized).toHaveProperty('price', 1000);
    });

    it('должен сохранять структурные данные', () => {
      const data = {
        id: '123',
        slug: 'test-service',
        category: 'therapy',
        status: 'active',
        price: 1000,
        duration: 60,
      };

      const sanitized = AuditDataSanitizer.sanitize(data);

      expect(sanitized).toEqual(data);
    });

    it('должен обрабатывать вложенные объекты', () => {
      const data = {
        id: '123',
        service: {
          id: '456',
          email: 'test@example.com', // P2
          name: 'Service Name',
        },
        price: 1000,
      };

      const sanitized = AuditDataSanitizer.sanitize(data);

      expect(sanitized).not.toBeNull();
      expect(sanitized).toHaveProperty('service');
      expect((sanitized as any).service).not.toHaveProperty('email');
      expect((sanitized as any).service).toHaveProperty('id', '456');
      expect((sanitized as any).service).toHaveProperty('name', 'Service Name');
    });

    it('должен возвращать null для null/undefined', () => {
      expect(AuditDataSanitizer.sanitize(null)).toBeNull();
      expect(AuditDataSanitizer.sanitize(undefined)).toBeNull();
    });
  });

  describe('createDiff', () => {
    it('должен создавать diff только изменённых полей', () => {
      const oldValue = {
        id: '123',
        price: 1000,
        name: 'Service',
      };

      const newValue = {
        id: '123',
        price: 1500, // Изменилось
        name: 'Service', // Не изменилось
      };

      const diff = AuditDataSanitizer.createDiff(oldValue, newValue);

      expect(diff.oldValue).toHaveProperty('price', 1000);
      expect(diff.newValue).toHaveProperty('price', 1500);
      expect(diff.oldValue).not.toHaveProperty('name');
      expect(diff.newValue).not.toHaveProperty('name');
    });

    it('должен санитизировать данные в diff', () => {
      const oldValue = {
        id: '123',
        price: 1000,
        email: 'old@example.com', // P2
      };

      const newValue = {
        id: '123',
        price: 1500,
        email: 'new@example.com', // P2
      };

      const diff = AuditDataSanitizer.createDiff(oldValue, newValue);

      expect(diff.oldValue).not.toHaveProperty('email');
      expect(diff.newValue).not.toHaveProperty('email');
      expect(diff.oldValue).toHaveProperty('price', 1000);
      expect(diff.newValue).toHaveProperty('price', 1500);
    });
  });
});
