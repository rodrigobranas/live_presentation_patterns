import Ticket from "./Ticket";

export default class TicketService {

	constructor () {
	}

	async createTicket (requesterId: string, content: string) {
		const ticket = Ticket.create(requesterId, content);
		await ticket.save();
		return ticket.ticketId;
	}

	async assignTicket (ticketId: string, assigneeId: string) {
		const ticket = await Ticket.load(ticketId);
		ticket.assign(assigneeId);
		await ticket.update();
	}

	async closeTicket (ticketId: string) {
		const ticket = await Ticket.load(ticketId);
		ticket.close();
		await ticket.update();
	}

	async getTicket (ticketId: string) {
		const ticket = await Ticket.load(ticketId);
		return ticket;
	}

}
