const env = {
  dev: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8801",
  },
  uat: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8801",
  },
};

export const url = env[import.meta.env.VITE_APP_ENV];