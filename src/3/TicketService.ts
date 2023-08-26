import Ticket from "./Ticket";
import TicketRepository from "./TicketRepository";
import TicketRepositoryDatabase from "./TicketRepositoryDatabase";

export default class TicketService {
	ticketRepository: TicketRepository;

	constructor () {
		this.ticketRepository = new TicketRepositoryDatabase();
	}

	async createTicket (requesterId: string, content: string) {
		const ticket = Ticket.create(requesterId, content);
		await this.ticketRepository.save(ticket);
		return ticket.ticketId;
	}

	async assignTicket (ticketId: string, assigneeId: string) {
		const ticket = await this.ticketRepository.get(ticketId);
		ticket.assign(assigneeId);
		await this.ticketRepository.update(ticket);
	}

	async closeTicket (ticketId: string) {
		const ticket = await this.ticketRepository.get(ticketId);
		ticket.close();
		await this.ticketRepository.update(ticket);
	}

	async getTicket (ticketId: string) {
		const ticket = await this.ticketRepository.get(ticketId);
		return ticket;
	}

}
