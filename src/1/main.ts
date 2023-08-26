import express from "express";
const app = express();
import crypto from "crypto";
import pgp from "pg-promise";

app.use(express.json());

app.post("/tickets", async function (req, res) {
	const ticketId = crypto.randomUUID();
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	await connection.query("insert into branas.ticket (ticket_id, requester_id, content, start_date, status) values ($1, $2, $3, $4, $5)", [ticketId, req.body.requesterId, req.body.content, new Date(), "open"]);
	await connection.$pool.end();
	res.json({
		ticketId
	});
});

app.post("/tickets/:ticketId/assign", async function (req, res) {
	const ticketId = crypto.randomUUID();
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [ticketData] = await connection.query("select * from branas.ticket where ticket_id = $1", [req.params.ticketId]);
	if (ticketData.status === "closed") throw new Error("The ticket is closed");
	await connection.query("update branas.ticket set status = $1, assignee_id = $2 where ticket_id = $3", [req.body.status, req.body.assigneeId, req.params.ticketId]);
	await connection.$pool.end();
	res.end();
});

app.post("/tickets/:ticketId/close", async function (req, res) {
	const ticketId = crypto.randomUUID();
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [ticketData] = await connection.query("select * from branas.ticket where ticket_id = $1", [req.params.ticketId]);
	if (ticketData.status === "open") throw new Error("The ticket is not assigned");
	const endDate = new Date();
	const startDate = ticketData.start_date;
	const duration = endDate.getTime() - startDate.getTime();
	await connection.query("update branas.ticket set status = $1, end_date = $2, duration = $3 where ticket_id = $4", [req.body.status, endDate, duration, req.params.ticketId]);
	await connection.$pool.end();
	res.end();
});


app.get("/tickets/:ticketId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [ticketData] = await connection.query("select * from branas.ticket where ticket_id = $1", [req.params.ticketId]);
	const ticket = {
		ticketId: ticketData.ticket_id,
		requesterId: ticketData.requester_id,
		assigneeId: ticketData.assignee_id,
		startDate: ticketData.start_date,
		endDate: ticketData.end_date,
		content: ticketData.content,
		status: ticketData.status,
		duration: ticketData.duration
	}
	await connection.$pool.end();
	res.json(ticket);
});

app.listen(3000);
