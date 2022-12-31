import { ChangeEvent, MouseEvent, useState } from "react";
import { GetServerSideProps } from "next";
import { SWRConfig } from "swr";
import { del, getServerSideFallbacks, post } from "@core/http/request";

import { PageProps } from "@pages/type";

import { SWRKeyType } from "@core/http/types";
import useSWR from "@hooks/useSWR";
import { ssrLangProps } from "@core/utils";
import { apiBase } from "@core/config";

import { Task } from "./type";
import styles from "./tasks.module.scss";

const API: SWRKeyType = [apiBase("/tasks")];

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	const fallback = await getServerSideFallbacks([API]);
	const transalations = await ssrLangProps(locale);

	return {
		props: {
			fallback,
			...transalations,
		},
	};
};

const Tasks = () => {
	const { data, mutate } = useSWR(API);
	const taskList: Task[] = data?.data;

	const [taskName, setTaskName] = useState("");

	const handleChangeTask = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		setTaskName(e.target.value);
	};

	const handleSubmitTask = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		post(apiBase("/tasks"), {
			data: {
				title: taskName,
			},
		}).then(() => {
			setTaskName("");
			mutate();
		});
	};

	const handleDeleteTask = (e: MouseEvent<HTMLButtonElement>, id: number) => {
		e.preventDefault();

		del(apiBase(`/tasks/${id}`)).then(() => {
			mutate();
		});
	};

	// there should be no `undefined` state when we have a fallback from SSR
	// console.log("data", data); // intentional logger

	return (
		<section className={styles.task}>
			<h1 className={styles.title}>To Do List</h1>
			<div className={styles.addTask}>
				<input
					type="text"
					placeholder="Enter task name"
					value={taskName}
					onChange={handleChangeTask}
				/>
				<button onClick={handleSubmitTask}>Add Task</button>
			</div>
			{taskList?.map((task) => {
				const { id, title } = task;

				return (
					<div key={id} className={styles.taskList}>
						<p>{title}</p>
						<button onClick={(e) => handleDeleteTask(e, id)}>delete</button>
					</div>
				);
			})}
		</section>
	);
};

const Page = ({ fallback = {} }: PageProps) => {
	return (
		<SWRConfig
			value={{
				fallback,
			}}
		>
			<Tasks />
		</SWRConfig>
	);
};

export default Page;
