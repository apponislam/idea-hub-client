"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

export const ImageCarousel = ({ images }: { images: string[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const scrollTo = React.useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi]
    );

    React.useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    return (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <div className="embla__viewport h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                    {images.map((img, index) => (
                        <div className="embla__slide flex-[0_0_100%] min-w-0 relative" key={index}>
                            <Image src={img} alt={`Idea image ${index + 1}`} fill className="object-cover" priority={index === 0} />
                        </div>
                    ))}
                </div>
            </div>

            {images.length > 1 && (
                <>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors" onClick={scrollPrev}>
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors" onClick={scrollNext}>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, index) => (
                            <button key={index} onClick={() => scrollTo(index)} className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-white w-4" : "bg-white/50"}`} aria-label={`Go to slide ${index + 1}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
