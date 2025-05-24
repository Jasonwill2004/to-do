import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearTestDB } from './test-db-setup.js';
import Todo from '../models/todo.model.js';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Todo Database Operations', () => {
  it('should create & save todo successfully', async () => {
    const validTodo = new Todo({
      text: 'Test todo',
      completed: false
    });
    const savedTodo = await validTodo.save();
    
    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.text).toBe(validTodo.text);
    expect(savedTodo.completed).toBe(validTodo.completed);
  });

  it('should fail to save todo without required field', async () => {
    const todoWithoutRequiredField = new Todo({ completed: false });
    let err;
    
    try {
      await todoWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should update todo successfully', async () => {
    const todo = new Todo({
      text: 'Original todo',
      completed: false
    });
    await todo.save();

    const updated = await Todo.findByIdAndUpdate(
      todo._id,
      { completed: true },
      { new: true }
    );

    expect(updated.completed).toBe(true);
  });

  it('should delete todo successfully', async () => {
    const todo = new Todo({
      text: 'Todo to be deleted',
      completed: false
    });
    await todo.save();

    await Todo.findByIdAndDelete(todo._id);
    const deletedTodo = await Todo.findById(todo._id);
    
    expect(deletedTodo).toBeNull();
  });
});