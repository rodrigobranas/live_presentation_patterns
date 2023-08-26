import Ticket from "./Ticket";

export default interface TicketRepository {
	save (ticket: Ticket): Promise<void>;
	update (ticket: Ticket): Promise<void>;
	get (ticketId: string): Promise<Ticket>;
}
