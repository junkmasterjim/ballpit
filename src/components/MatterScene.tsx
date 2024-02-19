"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter, { Mouse, MouseConstraint, Runner } from "matter-js";

const STATIC_DENSITY = 15;
const PARTICLE_SIZE = 28;
const PARTICLE_BOUNCYNESS = 0.9;

export const MatterScene = ({
	particleTrigger,
}: {
	particleTrigger: React.ComponentState;
}) => {
	const boxRef = useRef(null);
	const canvasRef = useRef(null);

	const [constraints, setContraints] = useState<any>();
	const [scene, setScene] = useState<any>();

	const handleResize = () => {
		// @ts-ignore
		setContraints(boxRef.current.getBoundingClientRect());
	};

	useEffect(() => {
		let Engine = Matter.Engine;
		let Render = Matter.Render;
		let World = Matter.World;

		let engine = Engine.create({});

		let render = Render.create({
			element: boxRef.current || undefined,
			engine: engine,
			canvas: canvasRef.current || undefined,
			options: {
				background: "transparent",
				wireframes: false,
			},
		});

		const floor = Matter.Bodies.rectangle(0, 0, 0, STATIC_DENSITY, {
			isStatic: true,
			label: "floor",
			render: {
				fillStyle: "transparent",
			},
		});

		const leftWall = Matter.Bodies.rectangle(0, 0, STATIC_DENSITY, 0, {
			isStatic: true,
			label: "leftWall",
			render: {
				fillStyle: "transparent",
			},
		});

		const rightWall = Matter.Bodies.rectangle(0, 0, STATIC_DENSITY, 0, {
			isStatic: true,
			label: "rightWall",
			render: {
				fillStyle: "transparent",
			},
		});

		const mouseConstraint = MouseConstraint.create(engine, {
			mouse: Mouse.create(boxRef.current!),
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
			body: boxRef.current || undefined,
		});

		World.add(engine.world, [mouseConstraint, floor, leftWall, rightWall]);

		Runner.run(engine);
		Render?.run(render);

		// @ts-ignore
		setContraints(boxRef.current.getBoundingClientRect());

		setScene(render);

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// ADD PARTICLES
	/*eslint-disable */
	useEffect(() => {
		if (scene) {
			for (let i = 0; i < 2; i++) {
				let { width, height } = constraints;
				let randomX = Math.floor(Math.random() * -width) + width;
				Matter.World.add(
					scene.engine.world,
					Matter.Bodies.circle(randomX, -PARTICLE_SIZE, PARTICLE_SIZE, {
						restitution: PARTICLE_BOUNCYNESS,

						render: {
							// sprite: {
							// 	texture: "/vercel.svg",
							// 	xScale: 0.5,
							// 	yScale: 0.5,
							// },
							fillStyle: "white",
							strokeStyle: "black",
							lineWidth: 2,
						},
					})
				);
			}
		}
	}, [particleTrigger]);
	/*eslint-enable */

	useEffect(() => {
		if (constraints) {
			let { width, height } = constraints;

			// Dynamically update canvas and bounds
			scene.bounds.max.x = width;
			scene.bounds.max.y = height;
			scene.options.width = width;
			scene.options.height = height;
			scene.canvas.width = width;
			scene.canvas.height = height;

			// Dynamically update floor
			const floor = scene.engine.world.bodies[0];

			Matter.Body.setPosition(floor, {
				x: width / 2,
				y: height + STATIC_DENSITY / 2,
			});

			Matter.Body.setVertices(floor, [
				{ x: 0, y: height },
				{ x: width, y: height },
				{ x: width, y: height + STATIC_DENSITY },
				{ x: 0, y: height + STATIC_DENSITY },
			]);

			// Dynamically update walls
			const leftWall = scene.engine.world.bodies[1];
			const rightWall = scene.engine.world.bodies[2];

			Matter.Body.setPosition(leftWall, {
				x: -STATIC_DENSITY / 2,
				y: height / 2,
			});

			Matter.Body.setVertices(leftWall, [
				{ x: 0, y: 0 },
				{ x: 0, y: height },
				{ x: STATIC_DENSITY, y: height },
				{ x: STATIC_DENSITY, y: 0 },
			]);

			Matter.Body.setPosition(rightWall, {
				x: width + STATIC_DENSITY / 2,
				y: height / 2,
			});

			Matter.Body.setVertices(rightWall, [
				{ x: 0, y: 0 },
				{ x: 0, y: height },
				{ x: STATIC_DENSITY, y: height },
				{ x: STATIC_DENSITY, y: 0 },
			]);
		}
	}, [scene, constraints]);

	return (
		<div
			ref={boxRef}
			className="relative border-b-2 overflow-hidden w-full h-full"
		>
			<canvas id="ballPit" ref={canvasRef} className="h-full w-full absolute" />
		</div>
	);
};
