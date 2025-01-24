const env = {
  dev: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8801",
    ticketService: "http://localhost:8802",
    branchService: "http://localhost:8803",
  },
  uat: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8801",
    ticketService: "http://localhost:8802",
    branchService: "http://localhost:8803",
  },
};

export const url = env[import.meta.env.VITE_APP_ENV];
