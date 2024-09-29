export default function Carousel() {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center p-8">
      <div className="relative w-full max-w-md aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">

        <h1>Carousel</h1>
        {/* {carouselItems.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === 0 ? 1 : 0 }} // You'll control this with Framer Motion
          >
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-lg font-semibold">
                {item.type === "headshot"
                  ? "Professional Headshot"
                  : "ATS-Optimized Resume"}
              </p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
