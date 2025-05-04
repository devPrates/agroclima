import Image from "next/image"
import { Leaf, Wheat, Carrot, Award } from "lucide-react"

export default function FeatureSection() {
  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">Grow Naturally</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#3c4a3e]">
            Choose What&apos;s Perfect
            <br />
            For Your Field
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Features */}
          <div className="md:col-span-3 space-y-8">
            <FeatureCircle
              icon={<Wheat className="h-6 w-6 text-[#3c4a3e]" />}
              title="Agriculture Products"
              description="Nullam porta enim vel tellus commodo, eget laoreet odio ultrices."
            />

            <FeatureCircle
              icon={<Award className="h-6 w-6 text-[#3c4a3e]" />}
              title="Quality Products"
              description="Nullam porta enim vel tellus commodo, eget laoreet odio ultrices."
            />
          </div>

          {/* Center Image */}
          <div className="md:col-span-6 flex justify-center items-center">
            <Image
              src="/weather-station.png"
              alt="Corn illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Right Features */}
          <div className="md:col-span-3 space-y-8">
            <FeatureCircle
              icon={<Carrot className="h-6 w-6 text-[#3c4a3e]" />}
              title="Fresh Vegetables"
              description="Nullam porta enim vel tellus commodo, eget laoreet odio ultrices."
            />

            <FeatureCircle
              icon={<Leaf className="h-6 w-6 text-[#3c4a3e]" />}
              title="Pure & Organic"
              description="Nullam porta enim vel tellus commodo, eget laoreet odio ultrices."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureCircleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCircle({ icon, title, description }: FeatureCircleProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex-shrink-0 bg-[#f0e68c] rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-lg text-[#3c4a3e] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-xs">{description}</p>
    </div>
  )
}
