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

	static restore (builder: any) {
		const ticket = new Ticket();
		ticket.ticketId = builder.ticketId;
		ticket.requesterId = builder.requesterId,
		ticket.assigneeId = builder.assigneeId,
		ticket.startDate = builder.startDate,
		ticket.endDate = builder.endDate,
		ticket.content = builder.content,
		ticket.status = builder.status,
		ticket.duration = builder.duration
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
}
