import { AssistanceResponse } from "@/client-assistance/core/domain/Action";
import { Question } from "@/data/questions";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATABASE_ID = process.env.NOTION_DATABASE_ID as string;

export const addFeedbackToNotion = async (data: AssistanceResponse): Promise<void> => {
  try {
    const res = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Fecha: { date: { start: new Date().toISOString() } },
        Id: { rich_text: [{ text: { content: data.questionId } }] },
        Pregunta: { title: [{ text: { content: data.question } }] },
        Respuesta: { rich_text: [{ text: { content: data.response } }] },
        Resultado: { select: { name: data.result } },
        'Green Flags': { rich_text: [{ text: { content: data.greenFlags.join(', ') } }] },
        'Red Flags': { rich_text: [{ text: { content: data.redFlags.join(', ') } }] },
      },
    });

    console.log("Registro añadido:", res.id);
  } catch (error: any) {
    console.error("Error añadiendo registro:", error.message);
    throw new Error("Failed to add feedback to Notion");
  }
};

export const getStrongYesFeedback = async (questionId: Question['id']): Promise<any[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Id',
            rich_text: {
              equals: questionId,
            },
          },
          {
            property: 'Resultado',
            select: {
              equals: 'Strong yes',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Fecha',
          direction: 'descending',
        },
      ],
      page_size: 10,
    });

    return response.results.map(r => {
      if (r.object === 'page') {
        const page = r as PageObjectResponse;
        if (page.properties.Respuesta !== undefined && page.properties.Respuesta.type === 'rich_text') {
          return page.properties.Respuesta.rich_text[0].plain_text;
        }
      }
      return "No response found";
    });
  } catch (error: any) {
    console.error("Error al obtener respuestas:", error.message);
    throw new Error("Failed to fetch feedback from Notion");
  }
};