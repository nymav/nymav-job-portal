import type { Company, Job } from "@/lib/generated/prisma";

const now = new Date("2026-10-01T12:00:00Z");
const company: Company = {
  id:"111111111111111111111111", userId:"preview", name:"Example Studio", description:"A fictional company for the interface preview.",
  mail:null,website:null,linkedIn:null,address_line_1:null,address_line_2:null,city:null,state:null,zipcode:null,
  followers:[],overview:null,whyJoinUs:null,createdAt:now,updatedAt:now,
};
export const previewJobs: (Job & {company:Company})[] = [
  {title:"Product Designer",workMode:"Remote",hourlyRate:"55",yearsOfExperience:"3–5 years",tags:["Product design","Figma"],short_description:"Shape clear, useful interfaces from early research through delivery."},
  {title:"Frontend Engineer",workMode:"Hybrid",hourlyRate:"65",yearsOfExperience:"2–4 years",tags:["React","TypeScript"],short_description:"Build accessible web experiences with a focus on maintainability and performance."},
  {title:"Data Engineer",workMode:"Remote",hourlyRate:"70",yearsOfExperience:"3–5 years",tags:["Python","SQL"],short_description:"Build reliable pipelines and make data easier for teams to use."},
].map((job,index) => ({...job,id:(index+2).toString().repeat(24),userId:"preview",description:job.short_description+" This is sample content, not a live vacancy.",imageUrl:null,isPublished:true,savedUsers:[],shiftTiming:"Full-time",categoryId:null,companyId:company.id,company,createdAt:now,updatedAt:now}));
