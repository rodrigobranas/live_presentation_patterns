import Ticket from "../src/3/Ticket"

test("Deve criar um ticket", function () {
	const ticket = Ticket.create("a", "b");
	expect(ticket.status).toBe("open");
	expect(ticket.content).toBe("b");
	expect(ticket.ticketId).toBeDefined();
	expect(ticket.requesterId).toBe("a");
});
