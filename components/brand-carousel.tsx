const logos = [
    {
      src: "/copasul.png",
      alt: "Transistor",
    },
    {
      src: "/porto-camargo.png",
      alt: "Reform",
    },
    {
      src: "/copasul.png",
      alt: "Tuple",
    },
    {
      src: "/porto-camargo.png",
      alt: "SavvyCal",
    },
    {
      src: "/copasul.png",
      alt: "Statamic",
    },
    {
      src: "/porto-camargo.png",
      alt: "Laravel",
    },
  ];
  
  export default function BrandCarousel() {
    return (
      <section className="container mx-auto">
        <div className="logos group relative overflow-hidden whitespace-nowrap py-10 [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-slide-left-infinite group-hover:animation-pause inline-block w-max"
            >
              {logos.map((logo, idx) => (
                <img
                  key={`${i}-${idx}`}
                  className="mx-4 inline h-16"
                  src={logo.src}
                  alt={logo.alt}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }