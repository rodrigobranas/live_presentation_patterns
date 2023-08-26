import crypto from "crypto";
import TicketDAODatabase from "./TicketDAODatabase";
import TicketDAO from "./TicketDAO";

export default class TicketService {
	ticketDAO: TicketDAO;

	constructor () {
		this.ticketDAO = new TicketDAODatabase();
	}

	async createTicket (requesterId: string, content: string) {
		const ticketId = crypto.randomUUID();
		const ticket = {
			ticketId,
			requesterId,
			startDate: new Date(),
			content,
			status: "open"
		};
		await this.ticketDAO.save(ticket);
		return ticketId;
	}

	async assignTicket (ticketId: string, assigneeId: string) {
		const ticket = await this.ticketDAO.get(ticketId);
		if (ticket.status === "closed") throw new Error("The ticket is closed");
		ticket.assigneeId = assigneeId;
		ticket.status = "assigned";
		await this.ticketDAO.update(ticket);
	}

	async closeTicket (ticketId: string) {
		const ticket = await this.ticketDAO.get(ticketId);
		if (ticket.status === "open") throw new Error("The ticket is not assigned");
		ticket.endDate = new Date();
		ticket.duration = ticket.endDate.getTime() - ticket.startDate.getTime();
		ticket.status = "closed";
		await this.ticketDAO.update(ticket);
	}

	async getTicket (ticketId: string) {
		const ticket = await this.ticketDAO.get(ticketId);
		return ticket;
	}

}
