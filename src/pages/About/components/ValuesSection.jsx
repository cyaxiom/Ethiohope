import React from 'react';
import Container from '@/components/ui/Container';

function ValuesSection() {
	return (
		<div className="relative py-20 overflow-hidden bg-muted/30 dark:bg-muted/60">
			<Container>
				<h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Our Values</h2>
				<div className="flex items-center mb-6">
					<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
					<div className="h-1 w-32 bg-gradient-to-r from-primary to-primary/20"></div>
				</div>
				<div className="flex flex-col md:flex-row gap-12">
					<div className="md:w-1/3">
						<h3 className="text-2xl font-bold mb-6 text-foreground">
							Propel your business forward
						</h3>
						<p className="text-lg mb-8 text-muted-foreground">
							We thrive on exploring the uncharted territories of creativity and technology,
							delivering solutions that break new ground. Our collective brilliance is the
							result of seamless teamwork, where every voice is valued, and every perspective matters.
						</p>
					</div>
					<div className="md:w-2/3 relative flex items-center justify-center min-h-[500px] mx-auto">
						{/* Central circle with gradient text */}
						<div className="absolute inset-0 flex items-center justify-center z-10">
							<div className="relative">
								<div className="w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 p-[3px] flex items-center justify-center">
									<div className="w-full h-full rounded-full bg-background flex items-center justify-center">
										<div className="text-center">
											<div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text">3 Key</div>
											<div className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text">Values</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Focus circle */}
						<div className="absolute top-0 right-[15%] md:right-1/4 z-20">
							<div className="bg-card rounded-full p-4 md:p-6 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center shadow-lg border border-border">
								<div className="text-center">
									<div className="w-10 md:w-14 h-10 md:h-14 mx-auto mb-2">
										<div className="w-full h-full rounded-full border-2 border-primary/70 relative flex items-center justify-center">
											<div className="w-6 md:w-8 h-6 md:h-8 bg-primary/20 rounded-full"></div>
											<div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
										</div>
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Focus</h3>
									<p className="text-muted-foreground text-xs md:text-sm max-w-[100px] md:max-w-[120px] mx-auto">
										We work with you to understand your unique needs
									</p>
								</div>
							</div>
						</div>
						{/* Commitment circle */}
						<div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 z-20">
							<div className="bg-card rounded-full p-4 md:p-6 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center shadow-lg border border-border">
								<div className="text-center">
									<div className="w-10 md:w-14 h-10 md:h-14 mx-auto mb-2 flex items-center justify-center">
										<svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-10 md:h-10">
											<path d="M20 2L2 20M20 2L38 20M20 2V38" stroke="currentColor" className="text-primary" strokeWidth="3"/>
										</svg>
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Commitment</h3>
									<p className="text-muted-foreground text-xs md:text-sm max-w-[120px] md:max-w-[140px] mx-auto">
										Enhancing our ability to deliver diverse and impactful solutions
									</p>
								</div>
							</div>
						</div>
						{/* Will circle */}
						<div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 z-20">
							<div className="bg-card rounded-full p-4 md:p-6 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center shadow-lg border border-border">
								<div className="text-center">
									<div className="w-10 md:w-14 h-10 md:h-14 mx-auto mb-2 flex items-center justify-center">
										<svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-10 md:h-10">
											<circle cx="20" cy="20" r="10" stroke="currentColor" className="text-primary" strokeWidth="2"/>
											<circle cx="20" cy="20" r="18" stroke="currentColor" className="text-primary" strokeWidth="2"/>
											<circle cx="20" cy="20" r="3" fill="currentColor" className="text-primary"/>
										</svg>
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Will</h3>
									<p className="text-muted-foreground text-xs md:text-sm max-w-[100px] md:max-w-[120px] mx-auto">
										The visionary behind it all and leads with a strategic mindset
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}

export default ValuesSection;
