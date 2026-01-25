"use client";

import { useEffect, useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "motion/react";
import "./style.css";

export default function CardList() {
	const [activeGame, setActiveGame] = useState(null);
	const ref = useRef(null);
	useOnClickOutside(ref, () => setActiveGame(null));

	useEffect(() => {
		function onKeyDown(event) {
			if (event.key === "Escape") {
				setActiveGame(null);
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<>
			<AnimatePresence>
				{activeGame ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="overlay"
					/>
				) : null}
			</AnimatePresence>
			<AnimatePresence>
				{activeGame ? (
					<div className="active-game">
						<motion.div
							layoutId={`card-${activeGame.title}`}
							className="inner"
							style={{ borderRadius: 12 }}
							ref={ref}
						>
							<div className="header">
								<motion.img
									layoutId={`image-${activeGame.title}`}
									height={56}
									width={56}
									alt="Game"
									src={activeGame.image}
									style={{ borderRadius: 12 }}
								/>
								<div className="header-inner">
									<div className="content-wrapper">
										<motion.h2
											layoutId={`title-${activeGame.title}`}
											className="game-title"
										>
											{activeGame.title}
										</motion.h2>
										<motion.p
											layoutId={`description-${activeGame.title}`}
											className="game-description"
										>
											{activeGame.description}
										</motion.p>
									</div>
									<motion.button
										layoutId={`button-${activeGame.title}`}
										className="button"
									>
										Get
									</motion.button>
								</div>
							</div>
							<motion.p
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, transition: { duration: 0.05 } }}
								className="long-description"
							>
								{activeGame.longDescription}
							</motion.p>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
			<ul className="list">
				{GAMES.map((game) => (
					<motion.li
						layoutId={`card-${game.title}`}
						key={game.title}
						onClick={() => setActiveGame(game)}
						style={{ borderRadius: 8 }}
					>
						<motion.img
							layoutId={`image-${game.title}`}
							height={56}
							width={56}
							alt="Game"
							src={game.image}
							style={{ borderRadius: 12 }}
						/>
						<div className="game-wrapper">
							<div className="content-wrapper">
								<motion.h2
									layoutId={`title-${game.title}`}
									className="game-title"
								>
									{game.title}
								</motion.h2>
								<motion.p
									layoutId={`description-${game.title}`}
									className="game-description"
								>
									{game.description}
								</motion.p>
							</div>
							<motion.button
								layoutId={`button-${game.title}`}
								className="button"
							>
								Get
							</motion.button>
						</div>
					</motion.li>
				))}
			</ul>
		</>
	);
}

const GAMES = [
	{
		title: "The Oddysey",
		description: "Explore unknown galaxies.",
		longDescription:
			"Throughout their journey, players will encounter diverse alien races, each with their own unique cultures and technologies. Engage in thrilling space combat, negotiate complex diplomatic relations, and make critical decisions that affect the balance of power in the galaxy.",
		image:
			"/lab/space.webp",
	},
	{
		title: "Angry Rabbits",
		description: "They are coming for you.",
		longDescription:
			"The rabbits are angry and they are coming for you. You have to defend yourself with your carrot gun. The game is not simple, you have to be fast and accurate to survive.",
		image:
			"/lab/rabbit.webp",
	},
	{
		title: "Ghost town",
		description: "Find the ghosts.",
		longDescription:
			"You are in a ghost town and you have to find the ghosts. But be careful, they are dangerous.",
		image:
			"/lab/ghost.webp",
	},
	{
		title: "Pirates in the jungle",
		description: "Find the treasure.",
		longDescription:
			"You are a pirate and you have to find the treasure in the jungle. But be careful, there are traps and wild animals.",
		image:
			"/lab/pirate.webp",
	},

	{
		title: "Lost in the mountains",
		description: "Find your way home.",
		longDescription:
			"You are lost in the mountains and you have to find your way home. But be careful, there are dangerous animals and you can get lost.",
		image:
			"/lab/boy.webp",
	},
];