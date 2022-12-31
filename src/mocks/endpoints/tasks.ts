import { rest } from "msw";

import { res } from "@mocks/helper";
import { db } from "@mocks/db";

import { apiBase } from "@core/config";
import StatusCodes from "@core/http/status-codes";

const tasks = [
	rest.get(apiBase("/tasks"), (req, _, ctx) => {
		const tasks = db.tasks.getAll() || [];
		return res(
			ctx.status(StatusCodes.OK),
			ctx.json({
				status: "ok",
				error: null,
				data: tasks,
			})
		);
	}),
	rest.post(apiBase("/tasks"), async (req, _, ctx) => {
		const { title } = await req.json();

		if (!title) {
			return res(
				ctx.status(StatusCodes.UNPROCESSABLE_ENTITY),
				ctx.json({
					status: "error",
					error: {
						code: "validation_error",
						meta: {
							message: "form is invalid",
							form: {
								title: "title is empty",
							},
						},
					},
				})
			);
		}

		const newTask = db.tasks.create({
			title,
		});

		return res(
			ctx.status(StatusCodes.OK),
			ctx.json({
				status: "ok",
				error: null,
				data: {
					id: newTask.id,
					title: newTask.title,
				},
			})
		);
	}),

	rest.delete(apiBase("/tasks/:id"), (req, _, ctx) => {
		const { id } = req.params;

		const existingTask = db.tasks.delete({
			where: {
				id: {
					equals: String(id),
				},
			},
		});

		if (!existingTask) {
			return res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR));
		}

		return res(ctx.status(StatusCodes.NO_CONTENT));
	}),
];

export default tasks;
