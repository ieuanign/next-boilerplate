import { ReactNode } from "react";
import styles from "./Layout.module.scss";

interface LayoutInterface {
	children: ReactNode;
}

const Layout = ({ children }: LayoutInterface) => {
	return (
		<div className={styles.container}>
			<header className={styles.header}>header</header>
			<main className={styles.main}>
				<aside className={styles.nav}>
					<nav>nav</nav>
				</aside>
				{children}
			</main>
			<footer className={styles.footer}>footer</footer>
		</div>
	);
};

export const StandardLayout = (page: ReactNode) => {
	return <Layout>{page}</Layout>;
};

export const EmptyLayout = (page: ReactNode) => {
	return page;
};
