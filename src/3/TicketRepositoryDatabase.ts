import Ticket from "./Ticket";
import TicketRepository from "./TicketRepository";
import pgp from "pg-promise";

export default class TicketRepositoryDatabase implements TicketRepository {

	async save(ticket: Ticket): Promise<void> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.ticket (ticket_id, requester_id, content, start_date, status) values ($1, $2, $3, $4, $5)", [ticket.ticketId, ticket.requesterId, ticket.content, ticket.startDate, ticket.status]);
		await connection.$pool.end();
	}

	async update(ticket: Ticket): Promise<void> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("update branas.ticket set status = $1, assignee_id = $2, end_date = $3, duration = $4 where ticket_id = $5", [ticket.status, ticket.assigneeId, ticket.endDate, ticket.duration, ticket.ticketId]);
		await connection.$pool.end();
	}

	async get(ticketId: string): Promise<Ticket> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ticketData] = await connection.query("select * from branas.ticket where ticket_id = $1", [ticketId]);
		const builder = {
			ticketId: ticketData.ticket_id,
			requesterId: ticketData.requester_id,
			assigneeId: ticketData.assignee_id,
			startDate: ticketData.start_date,
			endDate: ticketData.end_date,
			content: ticketData.content,
			status: ticketData.status,
			duration: ticketData.duration
		};
		const ticket = Ticket.restore(builder);
		await connection.$pool.end();
		return ticket;
	}

}
