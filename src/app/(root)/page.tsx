import { HeroBanner } from "@/components/Banner";
import IdeaPage from "@/components/publicIdea";
import IdeaPage2 from "@/components/topIdea";
import React from "react";

const page = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <IdeaPage></IdeaPage>
            <IdeaPage2></IdeaPage2>
        </div>
    );
};

export default page;
