const env = {
  dev: {
    portal: "http://localhost:3001",
    userService: "http://localhost:8802",
    ticketService: "http://localhost:8803",
    branchService: "http://localhost:8804",
    loggerService: "http://localhost:8805",
    resourceService: "http://localhost:8806",
  },
  uat: {
    portal: "https://v2.revivepharmacyportal.com.au",
    userService: "http://nadescrib.com:8802",
    ticketService: "http://nadescrib.com:8803",
    branchService: "http://nadescrib.com:8804",
    loggerService: "http://nadescrib.com:8805",
    resourceService: "http://nadescrib.com:8806",
  },
};

export const url = env[import.meta.env.VITE_APP_ENV];
