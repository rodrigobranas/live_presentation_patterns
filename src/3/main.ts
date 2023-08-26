import express from "express";
import TicketService from "./TicketService";
const app = express();

app.use(express.json());

const ticketService = new TicketService();

app.post("/tickets", async function (req, res) {
	const ticketId = await ticketService.createTicket(req.body.requesterId, req.body.content);
	res.json({
		ticketId
	});
});

app.post("/tickets/:ticketId/assign", async function (req, res) {
	await ticketService.assignTicket(req.params.ticketId, req.body.assigneeId);
	res.end();
});

app.post("/tickets/:ticketId/close", async function (req, res) {
	await ticketService.closeTicket(req.params.ticketId);
	res.end();
});


app.get("/tickets/:ticketId", async function (req, res) {
	const ticket = await ticketService.getTicket(req.params.ticketId);
	res.json(ticket);
});

app.listen(3000);
