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
  return text.split("\n\n").map((line) => line.trim());
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
    // Parse incoming request data
    const {
      personalInfo = {},
      educationInfo = { education: [] },
      experienceInfo = { experiences: [] },
      skillsInfo = { skills: [] },
      activitiesInfo = { activities: [] },
      projectsInfo = { projects: [] },
      certificationsInfo = { certifications: [] },
    } = await req.json();

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
            personalInfo.github || personalInfo.linkedIn
              ? new Paragraph({
                  text: `${personalInfo.github || ""} ${
                    personalInfo.linkedIn ? `| ${personalInfo.linkedIn}` : ""
                  }`,
                  alignment: AlignmentType.CENTER,
                })
              : null,

            // Skills Section
            new Paragraph({
              text: "Technical Skills",
              heading: HeadingLevel.HEADING_2,
            }),
            ...skillsInfo.skills.map(
              (skill: { category: string; items: string[] }) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${skill.category}: `,
                      bold: true,
                    }),
                    new TextRun({
                      text: skill.items.join(", "),
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
            ...educationInfo.education.map((edu: Education) => [
              new Paragraph({
                children: [new TextRun({ text: edu.school, bold: true })],
              }),
              new Paragraph({ text: edu.degree }),
              new Paragraph({
                text: `${new Date(edu.from).toLocaleDateString()} - ${new Date(
                  edu.to
                ).toLocaleDateString()}`,
              }),
            ]),

            // Work Experience Section
            new Paragraph({
              text: "Work Experience",
              heading: HeadingLevel.HEADING_2,
            }),
            ...experienceInfo.experiences.map((exp: Experience) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.company} - ${exp.position}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                text: `${new Date(exp.from).toLocaleDateString()} - ${
                  exp.to ? new Date(exp.to).toLocaleDateString() : "Present"
                }`,
              }),
              ...splitTextIntoParagraphs(exp.description).map(
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
            ...projectsInfo.projects.map((project: Project) => [
              new Paragraph({
                children: [
                  new TextRun({ text: project.name, bold: true }),
                ],
              }),
              ...splitTextIntoParagraphs(project.description).map(
                (paragraph) =>
                  new Paragraph({
                    text: paragraph,
                    spacing: { before: 120, after: 120 },
                  })
              ),
              new Paragraph({
                text: `${new Date(project.from).toLocaleDateString()} - ${
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
            ...activitiesInfo.activities.map((activity: Activity) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${activity.name} - ${activity.role}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                text: `${new Date(activity.from).toLocaleDateString()} - ${
                  activity.to
                    ? new Date(activity.to).toLocaleDateString()
                    : "Present"
                }`,
              }),
              ...splitTextIntoParagraphs(activity.description).map(
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
            ...certificationsInfo.certifications.map((cert: Certification) => [
              new Paragraph({
                children: [
                  new TextRun({ text: cert.title, bold: true }),
                ],
              }),
              new Paragraph({
                text: `Issuing Organization: ${cert.issuingOrganization}`,
              }),
              new Paragraph({
                text: `${new Date(cert.from).toLocaleDateString()} - ${
                  cert.to ? new Date(cert.to).toLocaleDateString() : "Present"
                }`,
              }),
              cert.credentialID
                ? new Paragraph({ text: `Credential ID: ${cert.credentialID}` })
                : null,
              cert.credentialURL
                ? new Paragraph({
                    text: `Credential URL: ${cert.credentialURL}`,
                  })
                : null,
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
