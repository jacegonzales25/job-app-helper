import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

// Helper function to split text into paragraphs based on `\n\n`
function splitTextIntoParagraphs(text: string): string[] {
  return text?.split("\n\n").map((line) => line.trim()) || [];
}

interface Education {
  school: string;
  degree: string;
  from: Date;
  to: Date;
}

interface Experience {
  company: string;
  position: string;
  from: Date;
  to?: Date;
  description: string;
}

interface Project {
  name: string;
  description: string;
  from: Date;
  to?: Date;
  companyName?: string;
}

interface Activity {
  name: string;
  role: string;
  from: Date;
  to?: Date;
  description: string;
}

interface Certification {
  title: string;
  issuingOrganization: string;
  from: Date;
  to?: Date;
  credentialID?: string;
  credentialURL?: string;
}

export async function POST(req: Request) {
  try {
    // Parse incoming request data with default fallback values
    const data = await req.json();
    const personalInfo = data.personalInfo || {
      fullName: "",
      location: "",
      email: "",
      contactNumber: "",
      github: "",
      linkedIn: "",
    };
    const educationInfo = data.educationInfo || { education: [] };
    const experienceInfo = data.experienceInfo || { experiences: [] };
    const skillsInfo = data.skillsInfo || { skills: [] };
    const activitiesInfo = data.activitiesInfo || { activities: [] };
    const projectsInfo = data.projectsInfo || { projects: [] };
    const certificationsInfo = data.certificationsInfo || {
      certifications: [],
    };

    // Ensure that arrays are not null or undefined
    const education = educationInfo.education || [];
    const experiences = experienceInfo.experiences || [];
    const skills = skillsInfo.skills || [];
    const activities = activitiesInfo.activities || [];
    const projects = projectsInfo.projects || [];
    const certifications = certificationsInfo.certifications || [];

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 360, // 0.5 inch
                bottom: 360, // 0.5 inch
                left: 360, // 0.5 inch
                right: 360, // 0.5 inch
              },
            },
          },
          children: [
            // Personal Info
            new Paragraph({
              text: personalInfo.fullName || "",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `${personalInfo.location || ""} | ${
                personalInfo.email || ""
              } | ${personalInfo.contactNumber || ""}`,
              alignment: AlignmentType.CENTER,
            }),
            (personalInfo.github || personalInfo.linkedIn) &&
              new Paragraph({
                text: `${personalInfo.github || ""} ${
                  personalInfo.linkedIn ? `| ${personalInfo.linkedIn}` : ""
                }`,
                alignment: AlignmentType.CENTER,
              }),

            // Skills Section
            new Paragraph({
              text: "Technical Skills",
              heading: HeadingLevel.HEADING_2,
            }),
            ...skills.map(
              (skill: { category: string; items: string[] }) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${skill.category || "Uncategorized"}: `,
                      bold: true,
                    }),
                    new TextRun({
                      text: (skill.items || []).join(", "),
                    }),
                  ],
                  spacing: { before: 120, after: 120 },
                })
            ),

            // Education Section
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_2,
            }),
            ...education.map((edu: Education) => [
              new Paragraph({
                children: [new TextRun({ text: edu.school || "", bold: true })],
              }),
              new Paragraph({ text: edu.degree || "" }),
              new Paragraph({
                text: `${
                  edu.from ? new Date(edu.from).toLocaleDateString() : "N/A"
                } - ${edu.to ? new Date(edu.to).toLocaleDateString() : "N/A"}`,
              }),
            ]),

            // Work Experience Section
            new Paragraph({
              text: "Work Experience",
              heading: HeadingLevel.HEADING_2,
            }),
            ...experiences.map((exp: Experience) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.company || ""} - ${exp.position || ""}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                text: `${
                  exp.from ? new Date(exp.from).toLocaleDateString() : "N/A"
                } - ${
                  exp.to ? new Date(exp.to).toLocaleDateString() : "Present"
                }`,
              }),
              ...splitTextIntoParagraphs(exp.description || "").map(
                (paragraph) =>
                  new Paragraph({
                    text: paragraph,
                    spacing: { before: 120, after: 120 },
                  })
              ),
            ]),

            // Projects Section
            new Paragraph({
              text: "Projects",
              heading: HeadingLevel.HEADING_2,
            }),
            ...projects.map((project: Project) => [
              new Paragraph({
                children: [
                  new TextRun({ text: project.name || "", bold: true }),
                ],
              }),
              ...splitTextIntoParagraphs(project.description || "").map(
                (paragraph) =>
                  new Paragraph({
                    text: paragraph,
                    spacing: { before: 120, after: 120 },
                  })
              ),
              new Paragraph({
                text: `${
                  project.from
                    ? new Date(project.from).toLocaleDateString()
                    : "N/A"
                } - ${
                  project.to
                    ? new Date(project.to).toLocaleDateString()
                    : "Present"
                }`,
              }),
            ]),

            // Leadership/Activities Section
            new Paragraph({
              text: "Leadership Experience & Activities",
              heading: HeadingLevel.HEADING_2,
            }),
            ...activities.map((activity: Activity) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${activity.name || ""} - ${activity.role || ""}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                text: `${
                  activity.from
                    ? new Date(activity.from).toLocaleDateString()
                    : "N/A"
                } - ${
                  activity.to
                    ? new Date(activity.to).toLocaleDateString()
                    : "Present"
                }`,
              }),
              ...splitTextIntoParagraphs(activity.description || "").map(
                (paragraph) =>
                  new Paragraph({
                    text: paragraph,
                    spacing: { before: 120, after: 120 },
                  })
              ),
            ]),

            // Certifications Section
            new Paragraph({
              text: "Certifications",
              heading: HeadingLevel.HEADING_2,
            }),
            ...certifications.map((cert: Certification) => [
              new Paragraph({
                children: [new TextRun({ text: cert.title || "", bold: true })],
              }),
              new Paragraph({
                text: `Issuing Organization: ${cert.issuingOrganization || ""}`,
              }),
              new Paragraph({
                text: `${
                  cert.from
                    ? new Date(cert.from).toLocaleDateString()
                    : "No issue date"
                } - ${
                  cert.to
                    ? new Date(cert.to).toLocaleDateString()
                    : "No expiry date"
                }`,
              }),
              cert.credentialID &&
                new Paragraph({ text: `Credential ID: ${cert.credentialID}` }),
              cert.credentialURL &&
                new Paragraph({
                  text: `Credential URL: ${cert.credentialURL}`,
                }),
            ]),
          ].flat(),
        },
      ],
    });

    // Generate DOCX and return response
    const buffer = await Packer.toBuffer(doc);
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=Resume.docx",
      },
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
