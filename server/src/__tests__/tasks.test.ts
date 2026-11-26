import request from 'supertest';
import { createApp } from '../app';
import { applySchema, closePool, resetTables } from './helpers/testDb';

const app = createApp();

async function registerAndGetToken(email: string): Promise<string> {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123' });
  return res.body.token;
}

beforeAll(async () => {
  await applySchema();
});

beforeEach(async () => {
  await resetTables();
});

afterAll(async () => {
  await closePool();
});

describe('tasks API (authenticated)', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('creates and lists a task', async () => {
    const token = await registerAndGetToken('owner@example.com');

    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write tests' });

    expect(create.status).toBe(201);
    expect(create.body.title).toBe('Write tests');
    expect(create.body.status).toBe('todo');

    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].title).toBe('Write tests');
  });

  it('updates a task status', async () => {
    const token = await registerAndGetToken('owner@example.com');
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ship it' });

    const update = await request(app)
      .patch(`/api/tasks/${create.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(update.status).toBe(200);
    expect(update.body.status).toBe('done');
  });

  it('deletes a task', async () => {
    const token = await registerAndGetToken('owner@example.com');
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete me' });

    const del = await request(app)
      .delete(`/api/tasks/${create.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);

    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(list.body).toHaveLength(0);
  });

  it("does not let a user touch another user's task", async () => {
    const aliceToken = await registerAndGetToken('alice@example.com');
    const bobToken = await registerAndGetToken('bob@example.com');

    const aliceTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ title: "Alice's secret" });

    const bobUpdate = await request(app)
      .patch(`/api/tasks/${aliceTask.body.id}`)
      .set('Authorization', `Bearer ${bobToken}`)
      .send({ status: 'done' });
    expect(bobUpdate.status).toBe(404);

    const bobList = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${bobToken}`);
    expect(bobList.body).toHaveLength(0);
  });
});
