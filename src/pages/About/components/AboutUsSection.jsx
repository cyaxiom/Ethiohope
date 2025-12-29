import React from 'react';
import Container from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

function AboutUsSection() {
	return (
		<div className="relative py-20 overflow-hidden bg-muted/30 dark:bg-muted/60">
			<Container className="relative z-10">
				<Card className="max-w-4xl mx-auto text-center mb-16 p-8 md:p-12 rounded-3xl border border-border shadow-xl bg-card">
					  <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text mb-4">
						ABOUT US
					</h1>
					<div className="flex items-center justify-center my-4">
						<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
						<div className="h-1 w-32 bg-gradient-to-r from-primary to-primary/20"></div>
					</div>
					  <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-foreground">
						We're More Than Just A Team Of Experts
					</h2>
					<div className="flex flex-col md:flex-row p-6 md:p-10 bg-card backdrop-blur-sm rounded-3xl border border-border shadow-xl">
						<div className="w-full md:w-1/2 text-left pr-0 md:pr-8">
							  <p className="text-lg mb-6 text-foreground">
								With a passion for innovation and a commitment to excellence, we've been
								empowering businesses to thrive in the digital landscape since
							</p>
							  <p className="text-lg mb-6 text-foreground">
								Our journey is rooted in a deep understanding of your goals, and our mission is
								to transform your visions into reality. With a track record of delivering
								exceptional results, we're here to propel your brand forward, together.
							</p>
						</div>
						<div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-1/2">
							<div className="bg-primary/10 p-6 rounded-2xl">
								<h3 className="text-6xl font-bold text-primary">+300</h3>
								  <p className="text-xl text-foreground mt-2">Developers</p>
							</div>
							<div className="flex flex-col space-y-6">
								<div className="bg-primary/10 p-6 rounded-2xl">
									  <p className="text-lg text-foreground font-medium">Founded In</p>
									  <p className="text-4xl font-bold text-primary">2011</p>
								</div>
								<div className="bg-primary/10 p-6 rounded-2xl">
									<h3 className="text-4xl font-bold text-primary">+1000</h3>
									  <p className="text-xl text-foreground mt-2">Projects</p>
								</div>
							</div>
						</div>
					</div>
					  <div className="mt-12 text-2xl italic text-muted-foreground mx-auto max-w-2xl">
						"It's not just about strategy, it's about the heart and soul you infuse into every endeavor."
					</div>
				</Card>
			</Container>
		</div>
	);
}

export default AboutUsSection;
