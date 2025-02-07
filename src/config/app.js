const env = {
  dev: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8801",
    ticketService: "http://localhost:8802",
    branchService: "http://localhost:8803",
    loggerService: "http://localhost:8804",
    resourceService: "http://localhost:8805",
  },
  uat: {
    portal: "http://nadescrib.com:3001",
    userService: "http://nadescrib.com:8801",
    ticketService: "http://nadescrib.com:8802",
    branchService: "http://nadescrib.com:8803",
    loggerService: "http://nadescrib.com:8804",
    resourceService: "http://nadescrib.com:8805",
  },
};

export const url = env[import.meta.env.VITE_APP_ENV];
