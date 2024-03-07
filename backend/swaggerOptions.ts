const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paper Company',
      version: '1.0.0',
      description: 'Witaj w repozytorium Systemu ERP dla Papier Company - zainspirowanego przez kultowy serial "The Office". Nasz system jest zaprojektowany, aby wspierać i optymalizować kluczowe procesy biznesowe w firmie zajmującej się dystrybucją papieru, od zarządzania zapasami po finanse i księgowość.',
    },
  },
  apis: ['./routes/userRoute/*.ts', './routes/captchaRoute/*.ts', './routes/adminRoute/*.ts'],
};

export default swaggerOptions;
