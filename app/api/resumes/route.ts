  import { NextResponse } from 'next/server';
  import { db } from '@/server/db/db'; // Adjust the path as needed
  import { eq } from 'drizzle-orm';
  import { resumes } from '@/server/db/schema'; // Import the resumes table

  // GET method for fetching a specific resume
  export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const resumeId = parseInt(params.id, 10);
      if (isNaN(resumeId)) {
        return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
      }

      const resumeDetails = await db.query.resumes.findFirst({
        where: (resumes) => eq(resumes.id, resumeId),
      });

      if (!resumeDetails) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      return NextResponse.json(resumeDetails);
    } catch (error) {
      console.error('Error fetching resume:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching the resume' },
        { status: 500 }
      );
    }
  }

  // PUT method for updating a specific resume
  export async function PUT(
      req: Request,
      { params }: { params: { id: string } }
    ) {
      try {
        const resumeId = parseInt(params.id, 10);
        if (isNaN(resumeId)) {
          return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
        }
    
        const body = await req.json();
        const updatedResume = await db
          .update(resumes) // Use the imported table directly
          .set(body)
          .where(eq(resumes.id, resumeId))
          .returning();
    
        return NextResponse.json(updatedResume);
      } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json(
          { error: 'An error occurred while updating the resume' },
          { status: 500 }
        );
      }
    }
    
    // DELETE method for deleting a specific resume
    export async function DELETE(
      req: Request,
      { params }: { params: { id: string } }
    ) {
      try {
        const resumeId = parseInt(params.id, 10);
        if (isNaN(resumeId)) {
          return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
        }
    
        const deletedResume = await db
          .delete(resumes) // Use the imported table directly
          .where(eq(resumes.id, resumeId))
          .returning();
    
        if (!deletedResume.length) {
          return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }
    
        return NextResponse.json(deletedResume);
      } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
          { error: 'An error occurred while deleting the resume' },
          { status: 500 }
        );
      }
    }