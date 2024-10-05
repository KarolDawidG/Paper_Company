const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paper Company',
      version: '1.0.0',
      description: 'Welcome to the ERP System API for Paper Company, inspired by the iconic TV show "The Office." This system is designed to support and optimize key business processes within a paper distribution company, from inventory management to finance and accounting.',
    },
  },
  apis: [
    './routes/addressRoute/*.ts', 
    './routes/adminRoute/*.ts', 
    './routes/basketRoute/*.ts',
    './routes/captchaRoute/*.ts', 
    './routes/clientRoute/*.ts', 
    './routes/employeeRoute/*.ts', 
    './routes/mailRoute/*.ts', 
    './routes/productsRoute/*.ts', 
    './routes/salesRoute/*.ts',
    './routes/userRoute/*.ts'
  ],
};

export default swaggerOptions;
