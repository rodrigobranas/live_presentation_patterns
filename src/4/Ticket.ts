import pgp from "pg-promise";
import crypto from "crypto";

export default class Ticket {
	ticketId?: string;
	requesterId?: string;
	assigneeId?: string;
	startDate?: Date;
	endDate?: Date;
	content?: string;
	status?: string;
	duration?: number;

	private constructor () {
	}

	static create (requesterId: string, content: string) {
		const ticket = new Ticket();
		ticket.ticketId = crypto.randomUUID();
		ticket.requesterId = requesterId;
		ticket.content = content;
		ticket.status = "open";
		ticket.startDate = new Date();
		return ticket;
	}

	static async load (ticketId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ticketData] = await connection.query("select * from branas.ticket where ticket_id = $1", [ticketId]);
		const ticket = new Ticket();
		ticket.ticketId = ticketData.ticket_id;
		ticket.requesterId = ticketData.requester_id,
		ticket.assigneeId = ticketData.assignee_id,
		ticket.startDate = ticketData.start_date,
		ticket.endDate = ticketData.end_date,
		ticket.content = ticketData.content,
		ticket.status = ticketData.status,
		ticket.duration = ticketData.duration
		await connection.$pool.end();
		return ticket;
	}

	assign (assigneeId: string) {
		if (this.status === "closed") throw new Error("The ticket is closed");
		this.assigneeId = assigneeId;
		this.status = "assigned";
	}

	close () {
		if (this.status === "open" || !this.startDate || !this.assigneeId) throw new Error("The ticket is not assigned");
		this.endDate = new Date();
		this.duration = this.endDate.getTime() - this.startDate.getTime();
		this.status = "closed";
	}

	async save () {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.ticket (ticket_id, requester_id, content, start_date, status) values ($1, $2, $3, $4, $5)", [this.ticketId, this.requesterId, this.content, this.startDate, this.status]);
		await connection.$pool.end();
	}

	async update () {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("update branas.ticket set status = $1, assignee_id = $2, end_date = $3, duration = $4 where ticket_id = $5", [this.status, this.assigneeId, this.endDate, this.duration, this.ticketId]);
		await connection.$pool.end();
	}
	
}
