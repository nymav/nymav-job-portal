import { PrismaClient } from "../lib/generated/prisma";

const database = new PrismaClient();

const main = async () => {
    try{
        await database.category.createMany({
            data:[
                {name: "Software Development"},
                {name: "Data Science"},
                {name: "Machine Learning"},
                {name: "Web Development"},
                {name: "Mobile Development"},
                {name: "DevOps"},
                {name: "Cloud Computing"},
                {name: "Cybersecurity"},
                {name: "Blockchain"},
                {name: "Artificial Intelligence"},
                {name: "Internet of Things"},
                {name: "Game Development"},
                {name: "Augmented Reality"},
                {name: "Virtual Reality"},
                {name: "Quantum Computing"},
                {name: "Robotics"},
                {name: "Natural Language Processing"},
                {name: "Computer Vision"},
                {name: "Data Engineering"},
                {name: "Big Data"},
                {name: "Data Visualization"},
                {name: "Business Intelligence"},
                {name: "Data Analytics"},
                {name: "Data Warehousing"},
                {name: "Data Governance"},
                {name: "Data Privacy"},
                {name: "Data Ethics"},
                {name: "Data Management"},
                {name: "Data Architecture"},
                {name: "Data Modeling"},
                {name: "Data Integration"},
                {name: "Data Quality"},
                {name: "Data Security"},
                {name: "Data Compliance"},
                {name: "Data Strategy"},
                {name: "Data Operations"},
            ],
            
        });
        console.log("Categories seeded successfully");
    }catch (error) {
        console.error(`Error seeding database: ${error}`);
    }
}

main();