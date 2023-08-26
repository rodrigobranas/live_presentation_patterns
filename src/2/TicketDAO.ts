export default interface TicketDAO {
	save (ticket: any): Promise<void>;
	update (ticket: any): Promise<void>;
	get (ticketId: string): Promise<any>;
	updateStatus (ticketId: string, status: string): Promise<void>;
}
