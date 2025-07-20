import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { fetchAboutData } from "../services/aboutService";
import type { AboutData } from "../types";
import {
    AboutContent,
    AboutSection,
    ProfileImage,
    SectionTitle,
} from "../styles";

export function About() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAboutData();
                setAboutData(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        };
        loadData();
    }, []);

    if (error) return <AboutSection id="about">Error: {error}</AboutSection>;
    if (!aboutData) return <AboutSection id="about">Loading...</AboutSection>;

    return (
        <>
            <SectionTitle>{aboutData.title}</SectionTitle>
            <AboutSection id="about">
                <ProfileImage
                    src={aboutData.imageUrl}
                    alt={aboutData.imageAlt}
                />
                <AboutContent>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {aboutData.content}
                    </ReactMarkdown>
                </AboutContent>
            </AboutSection>
        </>
    );
}
