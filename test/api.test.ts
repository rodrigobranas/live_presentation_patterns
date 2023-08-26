import axios from "axios";

test("Deve criar um novo ticket", async function () {
	const input1 = {
		requesterId: "b7e6db47-3e5d-4220-9265-0e6eef8c4330",
		content: "A internet está muito lenta"
	};
	const response1 = await axios.post("http://localhost:3000/tickets", input1);
	const output1 = response1.data;
	const response2 = await axios.get(`http://localhost:3000/tickets/${output1.ticketId}`);
	const output2 = response2.data;
	expect(output2.ticketId).toBeDefined();
	expect(output2.requesterId).toBe(input1.requesterId);
	expect(output2.content).toBe(input1.content);
	expect(output2.status).toBe("open");
});

test("Deve atribuir o ticket a um atendente", async function () {
	const input1 = {
		requesterId: "b7e6db47-3e5d-4220-9265-0e6eef8c4330",
		content: "A internet está muito lenta"
	};
	const response1 = await axios.post("http://localhost:3000/tickets", input1);
	const output1 = response1.data;

	const input2 = {
		assigneeId: "d88aa636-22f5-4da1-9384-077f80e51301",
		status: "assigned"
	};
	await axios.post(`http://localhost:3000/tickets/${output1.ticketId}/assign`, input2);

	const response3 = await axios.get(`http://localhost:3000/tickets/${output1.ticketId}`);
	const output3 = response3.data;
	expect(output3.assigneeId).toBe(input2.assigneeId);
	expect(output3.status).toBe("assigned");
});

test("Deve encerrar o ticket", async function () {
	const input1 = {
		requesterId: "b7e6db47-3e5d-4220-9265-0e6eef8c4330",
		content: "A internet está muito lenta"
	};
	const response1 = await axios.post("http://localhost:3000/tickets", input1);
	const output1 = response1.data;

	const input2 = {
		assigneeId: "d88aa636-22f5-4da1-9384-077f80e51301",
		status: "assigned"
	};
	await axios.post(`http://localhost:3000/tickets/${output1.ticketId}/assign`, input2);

	const input3 = {
		status: "closed"
	};
	await axios.post(`http://localhost:3000/tickets/${output1.ticketId}/close`, input3);

	const response4 = await axios.get(`http://localhost:3000/tickets/${output1.ticketId}`);
	const output4 = response4.data;
	expect(output4.endDate).toBeDefined();
	expect(output4.duration).toBeDefined();
	expect(output4.status).toBe("closed");
});
