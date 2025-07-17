describe("Smoke test: Create Ticket API", () => {
  it("should create a ticket successfully", () => {
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "admin@logisticsco.com",
        password: "password123",
      },
    }).then((loginRes) => {
      const token = loginRes.body.token;

      cy.request({
        method: "POST",
        url: "/api/tickets",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: "Smoke test ticket",
          description: "Created during Cypress smoke test",
        },
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.ticket).to.have.property("title", "Smoke test ticket");
      });
    });
  });
});
