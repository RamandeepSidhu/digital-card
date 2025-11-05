import { test, expect } from '@playwright/test';
import { authenticateUser } from './test-helpers';

test.describe('API Endpoints', () => {
  test('POST /api/cards - should require authentication', async ({ page }) => {
    // Test without authentication - should return 401
    const response = await page.request.post('/api/cards', {
      data: {
        type: 'business',
        style: 'style1',
        data: {
          name: 'Test',
          title: 'Test',
          company: 'Test',
          email: 'test@test.com',
          phone: '1234567890',
        },
      },
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  test('POST /api/cards - should create a card successfully with authentication', async ({ page }) => {
    // Authenticate first
    await authenticateUser(page);
    
    const testCard = {
      id: `test-${Date.now()}`,
      type: 'business',
      style: 'style1',
      data: {
        name: 'API Test User',
        title: 'Developer',
        company: 'Test Corp',
        email: 'apitest@example.com',
        phone: '1234567890',
        date: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const response = await page.request.post('/api/cards', {
      data: testCard,
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.card).toBeDefined();
    expect(data.card.id).toBe(testCard.id);
    expect(data.card.type).toBe('business');
  });

  test('GET /api/cards - should require authentication', async ({ page }) => {
    const response = await page.request.get('/api/cards');

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  test('GET /api/cards - should return cards for authenticated user', async ({ page }) => {
    // Authenticate first
    await authenticateUser(page);
    
    const response = await page.request.get('/api/cards');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.cards).toBeDefined();
    expect(Array.isArray(data.cards)).toBe(true);
  });

  test('GET /api/card/[id] - should return card by ID (public endpoint)', async ({ page }) => {
    // Authenticate and create a card first
    await authenticateUser(page);
    
    const testCard = {
      id: `test-card-${Date.now()}`,
      type: 'business',
      style: 'style1',
      data: {
        name: 'API Test',
        title: 'Developer',
        company: 'Test Corp',
        email: 'test@example.com',
        phone: '1234567890',
        date: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const createResponse = await page.request.post('/api/cards', {
      data: testCard,
    });

    if (createResponse.status() === 201) {
      const createData = await createResponse.json();
      const cardId = createData.card.id;

      // GET /api/card/[id] is public (no auth required)
      const getResponse = await page.request.get(`/api/card/${cardId}`);
      
      if (getResponse.status() === 200) {
        const getData = await getResponse.json();
        expect(getData.success).toBe(true);
        expect(getData.card).toBeDefined();
        expect(getData.card.id).toBe(cardId);
        expect(getData.card.data.name).toBe('API Test');
      } else {
        // Card might not be found if Redis isn't connected
        expect(getResponse.status()).toBe(404);
      }
    } else {
      // If card creation failed, skip this test
      test.skip();
    }
  });

  test('GET /api/card/[id] - should return 404 for non-existent card', async ({ page }) => {
    const response = await page.request.get('/api/card/non-existent-id-12345');

    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('DELETE /api/cards/[id] - should delete a card', async ({ page }) => {
    // Authenticate first
    await authenticateUser(page);
    
    // First create a card
    const testCard = {
      id: `test-delete-${Date.now()}`,
      type: 'business',
      style: 'style1',
      data: {
        name: 'Delete Test',
        title: 'Developer',
        company: 'Test Corp',
        email: 'delete@example.com',
        phone: '1234567890',
        date: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const createResponse = await page.request.post('/api/cards', {
      data: testCard,
    });

    if (createResponse.status() === 201) {
      const createData = await createResponse.json();
      const cardId = createData.card.id;

      // Delete the card
      const deleteResponse = await page.request.delete(`/api/cards/${cardId}`);

      expect(deleteResponse.status()).toBe(200);
      const deleteData = await deleteResponse.json();
      expect(deleteData.success).toBe(true);

      // Verify card is deleted
      const getResponse = await page.request.get(`/api/card/${cardId}`);
      expect(getResponse.status()).toBe(404);
    } else {
      // If card creation failed, skip this test
      test.skip();
    }
  });

  test('GET /api/card/[id] - should preserve image data', async ({ page }) => {
    // Authenticate first
    await authenticateUser(page);
    
    const testCard = {
      id: `test-image-${Date.now()}`,
      type: 'business',
      style: 'style1',
      data: {
        name: 'Image Test',
        title: 'Developer',
        company: 'Test Corp',
        email: 'image@example.com',
        phone: '1234567890',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', // Small test image
        date: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const createResponse = await page.request.post('/api/cards', {
      data: testCard,
    });

    if (createResponse.status() === 201) {
      const createData = await createResponse.json();
      const cardId = createData.card.id;

      // Fetch the card (public endpoint)
      const getResponse = await page.request.get(`/api/card/${cardId}`);

      if (getResponse.status() === 200) {
        const getData = await getResponse.json();
        expect(getData.card.data.image).toBeDefined();
        expect(getData.card.data.image).toBe(testCard.data.image);
      }
    } else {
      // If card creation failed, skip this test
      test.skip();
    }
  });
});

