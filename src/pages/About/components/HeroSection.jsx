import image3 from '../assets/image copy 2.png';
import image4 from '../assets/image copy 3.png';
import image5 from '../assets/image copy 4.png';
import image2 from '../assets/image copy.png';
import image1 from '../assets/image.png';
function HeroSection({ darkMode }) {
	return (
		<div className={`relative min-h-screen flex items-center justify-between overflow-hidden py-16 ${darkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'}` } style={{zIndex:10}}>
			{/* Fixed Floating Images at Edges/Corners */}
			<img src={image1} alt="Floating 1" className="floating-img absolute top-8 left-8 w-24 h-24 z-30" style={{filter:'drop-shadow(0 0 24px #60a5fa)'}} />
			<img src={image2} alt="Floating 2" className="floating-img absolute bottom-8 left-8 w-20 h-20 z-30" style={{filter:'drop-shadow(0 0 24px #34d399)'}} />
			<img src={image3} alt="Floating 3" className="floating-img absolute top-8 right-8 w-28 h-28 z-30" style={{filter:'drop-shadow(0 0 24px #a78bfa)'}} />
			<img src={image4} alt="Floating 4" className="floating-img absolute bottom-8 right-8 w-16 h-16 z-30" style={{filter:'drop-shadow(0 0 24px #f472b6)'}} />
			<img src={image5} alt="Floating 5" className="floating-img absolute top-1/2 left-1/2 w-20 h-20 z-30" style={{transform:'translate(-50%,-50%)',filter:'drop-shadow(0 0 24px #fbbf24)'}} />

			{/* Color Overlays for Interest */}
			<div className="absolute inset-0 z-20 pointer-events-none">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-400/20 via-green-300/10 to-transparent mix-blend-multiply"></div>
				<div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tr from-purple-400/20 via-pink-300/10 to-transparent mix-blend-multiply"></div>
				<div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
			</div>

			{/* Content - z-40 above all visuals */}
			<div className="container mx-auto px-6 flex flex-col md:flex-row items-center z-40 relative">
				<div className="w-full md:w-1/2 relative z-40 text-left pr-0 md:pr-8 mb-10 md:mb-0">
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
				<div className="w-full md:w-1/2 relative z-40">
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
