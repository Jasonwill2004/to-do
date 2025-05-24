import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Todo from '../models/todo.model.js';

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

describe('Todo API', () => {
  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      const todo = await Todo.create({ 
        text: 'Test todo',
        completed: false 
      });
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body[0].text).toBe(todo.text);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = { 
        text: 'New todo',
        completed: false 
      };
      const response = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(response.status).toBe(201);
      expect(response.body.text).toBe(todoData.text);
      expect(response.body.completed).toBe(todoData.completed);
    });
  });

  describe('PATCH /api/todos/:id', () => {
  it('should update an existing todo', async () => {
    // Create a test todo
    const todo = await Todo.create({ 
      text: 'Test todo',
      completed: false 
    });

    // Send PATCH request
    const response = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send({ completed: true });

    // Verify response
    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
    expect(response.body.text).toBe('Test todo');
  });

  it('should return 404 if todo not found', async () => {
    const response = await request(app)
      .patch(`/api/todos/654321654321654321654321`)
      .send({ completed: true });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Todo not found');
  });
});

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = await Todo.create({ 
        text: 'Test todo',
        completed: false 
      });
      const response = await request(app)
        .delete(`/api/todos/${todo._id}`);

      expect(response.status).toBe(200);
      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });
  });
});