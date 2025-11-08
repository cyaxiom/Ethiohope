import React from 'react';
React;
function AboutUsSection({ darkMode }) {
	return (
		<div className={`theme-bg-wrapper ${darkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'} relative py-20 overflow-hidden` }>
			<div className="container mx-auto px-6 relative z-10">
				<div className="max-w-4xl mx-auto text-center mb-16">
					  <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-blue-400 text-transparent bg-clip-text mb-4">
						ABOUT US
					</h1>
					<div className="flex items-center justify-center my-4">
						<div className="h-2 w-2 rounded-full bg-[#7601d3] mr-2"></div>
						<div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-green-400"></div>
					</div>
					  <h2 className={`text-4xl md:text-5xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
						We're More Than Just A Team Of Experts
					</h2>
					<div className="flex flex-col md:flex-row p-6 md:p-10bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 backdrop-blur-sm rounded-3xl border border-white/10 shadow-xl">
						<div className="w-full md:w-1/2 text-left pr-0 md:pr-8">
							  <p className={`text-lg mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
								With a passion for innovation and a commitment to excellence, we've been
								empowering businesses to thrive in the digital landscape since
							</p>
							  <p className={`text-lg mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
								Our journey is rooted in a deep understanding of your goals, and our mission is
								to transform your visions into reality. With a track record of delivering
								exceptional results, we're here to propel your brand forward, together.
							</p>
						</div>
						<div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-1/2">
							<div className="bg-gradient-to-br from-[#7601d3]/30 to-green-400/30 p-6 rounded-2xl">
								<h3 className="text-6xl font-bold text-white">+300</h3>
								  <p className="text-xl text-black mt-2">Developers</p>
							</div>
							<div className="flex flex-col space-y-6">
								<div className="bg-gradient-to-br from-blue-500/30 to-green-400/30 p-6 rounded-2xl">
									  <p className="text-lg text-black font-medium">Founded In</p>
									  <p className="text-4xl font-bold text-black">2011</p>
								</div>
								<div className="bg-gradient-to-br from-green-400/30 to-blue-500/30 p-6 rounded-2xl">
									<h3 className="text-4xl font-bold text-white">+1000</h3>
									  <p className="text-xl text-black mt-2">Projects</p>
								</div>
							</div>
						</div>
					</div>
					  <div className="mt-12 text-2xl italic text-black mx-auto max-w-2xl">
						"It's not just about strategy, it's about the heart and soul you infuse into every endeavor."
					</div>
				</div>
			</div>
		</div>
	);
}

export default AboutUsSection;
