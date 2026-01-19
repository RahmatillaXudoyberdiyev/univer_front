'use client'

const HeroSection = () => {

  return (
    <div className="mb-5 container-cs">
      <div className="flex justify-center items-center my-10 ">
        <video
          src="/logo_video.mp4"
          className=" w-full h-50 md:h-75 lg:h-100 xl:h-150 object-cover"
          autoPlay
          muted
          loop
          playsInline
          
        />
      </div>

    </div>
  )
}

export default HeroSection
