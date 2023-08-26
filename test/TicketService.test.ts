import TicketService2 from "../src/2/TicketService";
import TicketService4 from "../src/4/TicketService";

test("Deve criar um novo ticket", async function () {
	const input1 = {
		requesterId: "b7e6db47-3e5d-4220-9265-0e6eef8c4330",
		content: "A internet está muito lenta"
	};
	const ticketService = new TicketService2();
	const ticketId = await ticketService.createTicket(input1.requesterId, input1.content);
	const ticket = await ticketService.getTicket(ticketId);
	expect(ticket.ticketId).toBeDefined();
	expect(ticket.requesterId).toBe(input1.requesterId);
	expect(ticket.content).toBe(input1.content);
	expect(ticket.status).toBe("open");
});

test("Deve criar um novo ticket", async function () {
	const input1 = {
		requesterId: "b7e6db47-3e5d-4220-9265-0e6eef8c4330",
		content: "A internet está muito lenta"
	};
	const ticketService = new TicketService4();
	const ticketId = await ticketService.createTicket(input1.requesterId, input1.content);
	const ticket = await ticketService.getTicket(ticketId!);
	expect(ticket.ticketId).toBeDefined();
	expect(ticket.requesterId).toBe(input1.requesterId);
	expect(ticket.content).toBe(input1.content);
	expect(ticket.status).toBe("open");
});

