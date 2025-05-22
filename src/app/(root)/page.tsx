import { HeroBanner } from "@/components/Banner";
import FAQSection from "@/components/FAQSection";
import HomeBlogPage from "@/components/HomeBlogs";
import IdeaPage from "@/components/publicIdea";
import IdeaPage2 from "@/components/topIdea";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import React from "react";

const page = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <IdeaPage></IdeaPage>
            <IdeaPage2></IdeaPage2>
            <HomeBlogPage></HomeBlogPage>
            <FAQSection></FAQSection>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default page;
