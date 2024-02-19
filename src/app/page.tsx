"use client";

import { MatterScene } from "@/components/MatterScene";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
	const [addBall, setAddBall] = useState<number>(0);

	const handleAddBall = () => {
		setAddBall(addBall + 1);
	};

	return (
		<>
			<div className="flex relative pt-2 w-full justify-center z-[99999]">
				<Button onClick={handleAddBall}>Add Ball</Button>
			</div>
			<div className="fixed inset-0  mx-auto">
				<MatterScene particleTrigger={addBall} />
			</div>
		</>
	);
}
