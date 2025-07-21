/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/api/category.test.ts
import { POST, GET as GetAll } from '@/app/api/category/route';
import { PUT, DELETE, GET as GetById } from '@/app/api/category/[id]/route';
import { createMocks } from 'node-mocks-http';

let categoryId: string;

describe('Category API', () => {
  it('should create a category', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { name: 'Elektronik', prefix: 'EL' },
    });
    const res: any = await POST(req);
    const json = await res.json();

    categoryId = json.id;
    expect(res.status).toBe(200);
    expect(json.name).toBe('Elektronik');
  });

  it('should get all categories', async () => {
    createMocks({ method: 'GET' });
    const res: any = await GetAll();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
  });

  it('should get category by ID', async () => {
    const { req } = createMocks({ method: 'GET' });
    const res: any = await GetById(req, { params: { id: categoryId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(categoryId);
  });

  it('should update category', async () => {
    const { req } = createMocks({
      method: 'PUT',
      body: { name: 'Elektronik Updated', prefix: 'EL' },
    });
    const res: any = await PUT(req, { params: { id: categoryId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.name).toBe('Elektronik Updated');
  });

  it('should delete category', async () => {
    const { req } = createMocks({ method: 'DELETE' });
    const res: any = await DELETE(req, { params: { id: categoryId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('Category deleted successfully');
  });
});
