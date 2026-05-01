

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function KidsTutoring() {
	const navigate = useNavigate();
	return (
		<div className="w-full min-h-screen overflow-x-hidden bg-muted/30 dark:bg-muted/60 text-foreground font-sans">
			<section className="relative pt-20 pb-20 px-4 md:px-12 overflow-hidden">
				{/* Decorative gradients */}
				<div className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0">
					<div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-primary/20 dark:bg-primary/40"></div>
				</div>
				<div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0">
					<div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-accent/20 dark:bg-accent/40"></div>
				</div>
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
					{/* Left Text */}
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
							Kids Tutoring <span className="text-primary">Service</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-6">
							Ethiohope offers personalized tutoring for kids, helping them excel in coding and technology with engaging, hands-on lessons.
						</p>
						<button 
							onClick={() => navigate('/programs')}
							className="btn-primary"
						>
							Explore Courses
						</button>
					</div>
					{/* Right Image Placeholder */}
					<div>
						{/* You can add an image here if available */}
						<div className="card w-full max-w-md h-64 flex items-center justify-center text-muted-foreground">
							Image
						</div>
					</div>
				</div>
			</section>
			{/* Add more themed sections as needed */}
		</div>
	);
}

