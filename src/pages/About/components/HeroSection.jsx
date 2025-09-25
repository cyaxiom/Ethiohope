import React from 'react';
React;
function HeroSection({ darkMode }) {
	return (
		<div className={`relative min-h-screen flex items-center justify-between overflow-hidden py-16 ${darkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'}` }>
			{/* Background elements */}
			<div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/30 blur-3xl"></div>
			<div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-green-500/30 blur-3xl"></div>
			{/* Left side content */}
			<div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
				<div className="w-full md:w-1/2 relative z-20 text-left pr-0 md:pr-8 mb-10 md:mb-0">
					<h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-black'}`}>
									With A Passion For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">Commitment</span> To Success
								</h1>
					{/* Indicator dot and line */}
								<div className="flex items-center mb-10">
									<div className={`h-2 w-2 rounded-full ${darkMode ? 'bg-[#7601d3]' : 'bg-blue-400'} mr-2`}></div>
									<div className={`h-1 w-32 ${darkMode ? 'bg-gradient-to-r from-blue-500 to-green-400' : 'bg-gradient-to-r from-blue-300 to-green-200'}`}></div>
					</div>
				</div>
				{/* Right side image */}
				<div className="w-full md:w-1/2 relative z-10">
					<div className="relative overflow-hidden rounded-lg">
						<img 
							src="https://res.cloudinary.com/skyrev/image/upload/v1692613891/bungalion/photos/l53_ghhq17.jpg" 
							alt="Hero" 
							className="w-full max-h-[50vh] object-cover"
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
								<div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HeroSection;
