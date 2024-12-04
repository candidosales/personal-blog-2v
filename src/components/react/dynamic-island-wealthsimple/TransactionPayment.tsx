"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import NumberFlow from '@number-flow/react'

export function TransactionPayment({ amount }: { amount: number }) {
	const [amountDelay, setAmountDelay] = useState(0);

	useEffect(() => {
		if (amount) {
			setTimeout(() => {
				setAmountDelay(amount)
			}, 300)
		}
	}, [amount])

	return (
		<div className="flex w-[284px] items-center gap-2 pr-5 pl-3.5 py-3">
			<motion.img
				key={'image-card'}
				className="rounded-xl"
				alt="Wealthsimple Visa Infinite"
				src={'/wealthsimple-card.png'}
				height={30}
				width={60}
				transition={{
					type: "spring",
				}}
				initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
				animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
				exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
			/>
			<motion.div
				key={'amount-counter'}
				transition={{
					type: "spring",
				}}
				initial={{
					scale: 0.9,
					opacity: 0,
					filter: "blur(5px)",
					originX: 0,
					originY: 0.5,
				}}
				animate={{
					scale: 1,
					opacity: 1,
					filter: "blur(0px)",
					originX: 0,
					originY: 0.5,
					transition: {
						delay: 0.25,
					},
				}}

				className="flex items-baseline gap-1.5 text-white ml-auto pr-0.5"
			>
				<motion.p className="text-base font-normal">You paid</motion.p>
				<NumberFlow
					className="text-base font-normal"
					style={{ fontFamily: 'Inter' }}
					animated={true}
					value={amountDelay}
					format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
				/>
			</motion.div>
		</div>
	);
}