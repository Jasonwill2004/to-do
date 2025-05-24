export default {
  mongodb: {
    uri: 'mongodb://127.0.0.1:27017/todo-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  server: {
    port: 5001
  }
};