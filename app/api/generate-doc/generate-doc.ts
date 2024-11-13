import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { useResumeStore } from "@/store/resume-store";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    personalInfo,
    educationInfo,
    experienceInfo,
    skillsInfo,
    activitiesInfo,
    projectsInfo,
    certificationsInfo,
  } = useResumeStore.getState();

  const doc = new Document({
    sections: [
      // Personal Info
      {
        children: personalInfo
          ? [
              new Paragraph({
                text: personalInfo.fullName,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `${personalInfo.location} | ${personalInfo.email} | ${personalInfo.contactNumber}`,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `${personalInfo.github ?? ""} ${
                  personalInfo.linkedIn ? `| ${personalInfo.linkedIn}` : ""
                }`,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: "" }), // Spacer
            ]
          : [],
      },
      // Skills Section
      {
        children: skillsInfo
          ? [
              new Paragraph({
                text: "Technical Skills",
                heading: HeadingLevel.HEADING_2,
              }),
              ...skillsInfo.skills.map(
                (skill) =>
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
                  })
              ),
              new Paragraph({ text: "" }), // Spacer
            ]
          : [],
      },
      // Education Section
      {
        children: educationInfo
          ? [
              new Paragraph({
                text: "Education",
                heading: HeadingLevel.HEADING_2,
              }),
              ...educationInfo.education
                .map((edu) => [
                  new Paragraph({
                    children: [new TextRun({ text: edu.school, bold: true })],
                  }),
                  new Paragraph({ text: edu.degree }),
                  new Paragraph({
                    text: `${edu.from.toLocaleDateString()} - ${edu.to.toLocaleDateString()}`,
                  }),
                  new Paragraph({ text: "" }), // Spacer
                ])
                .flat(),
            ]
          : [],
      },
      // Work Experience Section
      {
        children: experienceInfo
          ? [
              new Paragraph({
                text: "Work Experience",
                heading: HeadingLevel.HEADING_2,
              }),
              ...experienceInfo.experiences
                .map((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${exp.company} - ${exp.position}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    text: `${exp.from.toLocaleDateString()} - ${
                      exp.to?.toLocaleDateString() ?? "Present"
                    }`,
                  }),
                  new Paragraph({ text: exp.description }),
                  new Paragraph({ text: "" }), // Spacer
                ])
                .flat(),
            ]
          : [],
      },
      // Projects Section
      {
        children: projectsInfo
          ? [
              new Paragraph({
                text: "Projects",
                heading: HeadingLevel.HEADING_2,
              }),
              ...projectsInfo.projects
                .map((project) => [
                  new Paragraph({
                    children: [new TextRun({ text: project.name, bold: true })],
                  }),
                  new Paragraph({ text: project.description }),
                  new Paragraph({
                    text: `${project.from.toLocaleDateString()} - ${
                      project.to?.toLocaleDateString() ?? "Present"
                    }`,
                  }),
                  new Paragraph({
                    text: project.companyName
                      ? `Company: ${project.companyName}`
                      : "",
                  }),
                  new Paragraph({ text: "" }), // Spacer
                ])
                .flat(),
            ]
          : [],
      },
      // Leadership/Activities Section
      {
        children: activitiesInfo?.activities
          ? [
              new Paragraph({
                text: "Leadership Experience & Activities",
                heading: HeadingLevel.HEADING_2,
              }),
              ...activitiesInfo.activities
                .map((activity) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${activity.name} - ${activity.role}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    text: `${activity.from.toLocaleDateString()} - ${
                      activity.to?.toLocaleDateString() ?? "Present"
                    }`,
                  }),
                  new Paragraph({ text: activity.description }),
                  new Paragraph({ text: "" }), // Spacer
                ])
                .flat(),
            ]
          : [],
      },
      // Certifications Section
      {
        children: certificationsInfo?.certifications
          ? [
              new Paragraph({
                text: "Certifications",
                heading: HeadingLevel.HEADING_2,
              }),
              ...certificationsInfo.certifications
                .map((cert) => [
                  new Paragraph({
                    children: [new TextRun({ text: cert.title, bold: true })],
                  }),
                  new Paragraph({
                    text: `Issuing Organization: ${cert.issuingOrganization}`,
                  }),
                  new Paragraph({
                    text: `${cert.from.toLocaleDateString()} - ${
                      cert.to?.toLocaleDateString() ?? "Present"
                    }`,
                  }),
                  new Paragraph({
                    text: cert.credentialID
                      ? `Credential ID: ${cert.credentialID}`
                      : "",
                  }),
                  new Paragraph({
                    text: cert.credentialURL
                      ? `Credential URL: ${cert.credentialURL}`
                      : "",
                  }),
                  new Paragraph({ text: "" }), // Spacer
                ])
                .flat(),
            ]
          : [],
      },
    ],
  });

  // Generate DOCX and send as response
  const buffer = await Packer.toBuffer(doc);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader("Content-Disposition", "attachment; filename=Resume.docx");
  res.send(buffer);
}
