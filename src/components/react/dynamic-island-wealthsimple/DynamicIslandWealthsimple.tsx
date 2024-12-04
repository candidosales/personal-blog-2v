"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TransactionPayment } from "./TransactionPayment";

export default function DynamicIslandWealthsimple() {
	const [view, setView] = useState("idle");
	const [variantKey, setVariantKey] = useState("idle");

	const content = useMemo(() => {
		switch (view) {
			case "transaction":
				return <TransactionPayment amount={100.23} />;
			case "idle":
				return <div className="h-7" />;
		}
	}, [view]);

	return (
		<div className="h-[200px]">
			<div className="relative flex h-full w-full flex-col justify-between">
				<motion.div
					layout
					transition={{
						type: "spring",
						bounce: BOUNCE_VARIANTS[variantKey],
					}}
					style={{ borderRadius: 32 }}
					className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
				>
					<motion.div
						transition={{
							type: "spring",
							bounce: BOUNCE_VARIANTS[variantKey],
						}}
						initial={{
							scale: 0.9,
							opacity: 0,
							filter: "blur(5px)",
							originX: 0.5,
							originY: 0.5,
						}}
						animate={{
							scale: 1,
							opacity: 1,
							filter: "blur(0px)",
							originX: 0.5,
							originY: 0.5,
							transition: {
								delay: 0.05,
							},
						}}
						key={view}
					>
						{content}
					</motion.div>
				</motion.div>

				<div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
					<AnimatePresence
						mode="popLayout"
						custom={ANIMATION_VARIANTS[variantKey]}
					>
						<motion.div
							initial={{ opacity: 0 }}
							exit="exit"
							variants={variants}
							key={view}
						>
							{content}
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="flex w-full justify-center gap-4">
					{["idle", "transaction"].map((v) => (
						<button
							type="button"
							className="rounded-full capitalize w-32 h-10 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300/50 hover:bg-gray-50"
							onClick={() => {
								setView(v);
								setVariantKey(`${view}-${v}`);
							}}
							key={v}
						>
							{v}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

const variants = {
	exit: (transition) => {
		return {
			...transition,
			opacity: [1, 0],
			filter: "blur(5px)",
		};
	},
};

const ANIMATION_VARIANTS = {
	"ring-idle": {
		scale: 0.9,
		scaleX: 0.9,
		bounce: 0.5,
	},
	"transaction-ring": {
		scale: 0.7,
		y: -7.5,
		bounce: 0.35,
	},
	"ring-transaction": {
		scale: 1.4,
		y: 7.5,
		bounce: 0.35,
	},
	"transaction-idle": {
		scale: 0.7,
		y: -7.5,
		bounce: 0.3,
	},
};

const BOUNCE_VARIANTS = {
	idle: 0.5,
	"ring-idle": 0.5,
	"transaction-ring": 0.35,
	"ring-transaction": 0.35,
	"transaction-idle": 0.3,
	"idle-transaction": 0.3,
	"idle-ring": 0.5,
};
