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
    userService: "https://nadescrib.com:4402",
    ticketService: "https://nadescrib.com:4403",
    branchService: "https://nadescrib.com:4404",
    loggerService: "https://nadescrib.com:4405",
    resourceService: "https://nadescrib.com:4406",
  },
};

export const url = env[import.meta.env.VITE_APP_ENV];
