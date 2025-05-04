import Image from "next/image"
import { Sprout, Tractor } from "lucide-react"

export default function AboutSection() {
    return (
        <section className="w-full py-16" id="about">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left column with image and stats */}
                    <div className="relative mb-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src="/image-about.png"
                                alt="Farmer tending to organic plants"
                                width={500}
                                height={400}
                                className="h-auto w-full object-cover"
                            />

                            {/* Stats box - positioned inside the image container */}
                            <div className="absolute bottom-0 right-0 w-32 rounded-lg bg-white p-3 text-center sm:w-36 sm:p-4">
                                <div className="bg-yellow-300 p-2 rounded-lg">
                                    <div className="text-3xl font-bold text-stone-800 sm:text-4xl">
                                        <span className="text-green-600">*</span>435<span className="text-xl">+</span>
                                    </div>
                                    <div className="mt-1 text-xs text-stone-700 sm:text-sm">Growth Time of Harvest</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column with content */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 text-sm font-medium text-stone-500">Who We Are</div>

                        <h2 className="mb-6 text-3xl font-bold text-stone-700 md:text-4xl">
                            Currently we are growing and selling organic food
                        </h2>

                        <p className="mb-8 text-stone-600">
                            There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration
                            in some form, by injected humour, or randomised words which don't look even.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {/* Feature 1 */}
                            <div>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-green-50">
                                    <Sprout className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-stone-700">Eco Farms Worldwide</h3>
                                <p className="text-sm text-stone-500">
                                    There are many variations of passages of lorem ipsum available, majority have suffered.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-green-50">
                                    <Tractor className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-stone-700">Special Equipment</h3>
                                <p className="text-sm text-stone-500">
                                    There are many variations of passages of lorem ipsum available, majority have suffered.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
